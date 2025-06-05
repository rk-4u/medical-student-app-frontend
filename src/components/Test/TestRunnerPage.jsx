import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Draggable from "react-draggable";
import { Menu, Clock, Flag, ChevronLeft, ChevronRight, Calculator as CalculatorIcon, Beaker, Sun, Moon, Check, StickyNote } from "lucide-react";
import MediaDisplay from "../Media/MediaDisplay";
import Calculator from "../Reusable/Calculator";
import LabValuesModal from "../Reusable/LabValuesModal";
import { useTheme } from "../../contexts/ThemeContext";

const MediaModal = ({ media, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl max-h-[80vh] overflow-auto">
        {media.map((m, i) => (
          <MediaDisplay key={i} media={m} />
        ))}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const TestRunnerPage = () => {
  const nodeRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");
  const highlightMenuRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [testSessionId, setTestSessionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [submissionResults, setSubmissionResults] = useState({});
  const [highlights, setHighlights] = useState({});
  const [struckOptions, setStruckOptions] = useState({});
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 });
  const [tempHighlight, setTempHighlight] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaToShow, setMediaToShow] = useState([]);
  const [hiddenExplanations, setHiddenExplanations] = useState([]);

  const testData = location.state || JSON.parse(sessionStorage.getItem("testData")) || {};
  const usePerQuestionTimer = testData.testDuration > 0;

  useEffect(() => {
    const initializeTest = () => {
      const { testSessionId, questions } = testData;
      if (!testSessionId || !questions || questions.length === 0) {
        alert("Invalid test data. Please start a new test.");
        navigate("/dashboard/filter");
        return;
      }
      setTestSessionId(testSessionId);
      setQuestions(questions);
      setUserAnswers(
        questions.map((q) => ({
          questionId: q._id,
          selectedAnswer: null,
          note: q.userInteraction?.note || "",
          isFlagged: q.userInteraction?.isFlagged || false,
        }))
      );
      setHighlights(JSON.parse(sessionStorage.getItem(`highlights_${testSessionId}`)) || {});
      setStruckOptions(JSON.parse(sessionStorage.getItem(`struck_${testSessionId}`)) || {});
    };
    initializeTest();
  }, [testData, navigate]);

  useEffect(() => {
    if (!usePerQuestionTimer || !timeLeft || submitting) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitting, currentQuestionIndex, usePerQuestionTimer]);

  useEffect(() => {
    if (usePerQuestionTimer) setTimeLeft(testData.testDuration || 90);
  }, [currentQuestionIndex, usePerQuestionTimer, testData.testDuration]);

  useEffect(() => {
    if (testSessionId) {
      sessionStorage.setItem(`highlights_${testSessionId}`, JSON.stringify(highlights));
      sessionStorage.setItem(`struck_${testSessionId}`, JSON.stringify(struckOptions));
    }
  }, [highlights, struckOptions, testSessionId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (highlightMenuRef.current && !highlightMenuRef.current.contains(e.target)) {
        setShowHighlightMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = { ...updated[currentQuestionIndex], selectedAnswer: answerIndex };
      return updated;
    });
  };

  const toggleStrike = (optionIndex) => {
    if (isSubmitted) return;
    setStruckOptions((prev) => {
      const qId = currentQuestion._id;
      const current = prev[qId] || [];
      if (current.includes(optionIndex)) {
        return { ...prev, [qId]: current.filter((i) => i !== optionIndex) };
      } else {
        return { ...prev, [qId]: [...current, optionIndex] };
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleUpdateInteraction = async (action = "submit") => {
    const currentQuestion = questions[currentQuestionIndex];
    const interaction = userAnswers[currentQuestionIndex];
    const payload = { testId: testSessionId };

    if (action === "submit" && interaction.selectedAnswer !== null) {
      payload.selectedAnswer = interaction.selectedAnswer;
    } else if (action === "flag") {
      payload.isFlagged = !interaction.isFlagged;
    } else if (action === "skip") {
      payload.isFlagged = interaction.isFlagged;
    }

    setSubmitting(true);
    try {
      const response = await axios.put(
        `https://medical-student-app-backend.onrender.com/api/questions/${currentQuestion._id}/interaction`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserAnswers((prev) =>
        prev.map((a, i) =>
          i === currentQuestionIndex ? { ...a, isFlagged: response.data.userInteractions[0].isFlagged } : a
        )
      );

      if (action !== "flag") {
        setSubmittedQuestions((prev) => [...new Set([...prev, currentQuestion._id])]);
        setSubmissionResults((prev) => ({
          ...prev,
          [currentQuestion._id]: {
            isCorrect: response.data.userInteractions[0].isCorrect,
            selectedAnswer: payload.selectedAnswer,
          },
        }));
        if (currentQuestionIndex < questions.length - 1) {
          handleNextQuestion();
        } else {
          await handleEndTest();
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        alert("Failed to process action.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveNote = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const interaction = userAnswers[currentQuestionIndex];
    try {
      await axios.put(
        `https://medical-student-app-backend.onrender.com/api/questions/${currentQuestion._id}/interaction`,
        { testId: testSessionId, note: interaction.note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivePanel(null);
    } catch (err) {
      alert("Failed to save note.");
    }
  };

  const handleAutoSubmit = async () => {
    await handleUpdateInteraction("skip");
  };

  const handleEndTest = async () => {
    setSubmitting(true);
    try {
      const unsubmittedIds = questions.filter((q) => !submittedQuestions.includes(q._id)).map((q) => q._id);
      for (const id of unsubmittedIds) {
        const index = questions.findIndex((q) => q._id === id);
        if (index !== -1) {
          const payload = { testId: testSessionId, selectedAnswer: null, isFlagged: userAnswers[index].isFlagged };
          await axios.put(
            `https://medical-student-app-backend.onrender.com/api/questions/${id}/interaction`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSubmittedQuestions((prev) => [...new Set([...prev, id])]);
          setSubmissionResults((prev) => ({
            ...prev,
            [id]: { isCorrect: false, selectedAnswer: null },
          }));
        }
      }
      await axios.post(`https://medical-student-app-backend.onrender.com/api/tests/${testSessionId}/submit`, {}, { headers: { Authorization: `Bearer ${token}` } });
      sessionStorage.removeItem(`highlights_${testSessionId}`);
      sessionStorage.removeItem(`struck_${testSessionId}`);
      sessionStorage.removeItem("testData");
      navigate(`/test-detail/${testSessionId}`);
    } catch (err) {
      alert("Failed to end test.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelTest = async () => {
    try {
      await axios.post(`https://medical-student-app-backend.onrender.com/api/tests/${testSessionId}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      sessionStorage.removeItem(`highlights_${testSessionId}`);
      sessionStorage.removeItem(`struck_${testSessionId}`);
      sessionStorage.removeItem("testData");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to cancel test.");
    }
  };

  const handleTextSelection = (e, isExplanation = false) => {
    const selection = window.getSelection();
    if (selection.rangeCount && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();
      setTempHighlight({
        questionId: currentQuestion._id,
        text: selectedText,
        start: range.startOffset,
        end: range.endOffset,
        isExplanation,
        key: `${currentQuestion._id}_${Date.now()}_${Math.random()}`,
      });
      setHighlightPosition({ x: e.clientX, y: e.clientY });
      setShowHighlightMenu(true);
    }
  };

  const applyHighlight = (color) => {
    if (tempHighlight) {
      setHighlights((prev) => ({ ...prev, [tempHighlight.key]: { ...tempHighlight, color } }));
      setShowHighlightMenu(false);
      setTempHighlight(null);
      window.getSelection().removeAllRanges();
    }
  };

  const removeHighlight = (key) => {
    setHighlights((prev) => {
      const updated = { ...prev };
      delete updated[key];
      sessionStorage.setItem(`highlights_${testSessionId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const renderHighlightedText = (text, questionId, isExplanation = false) => {
    const highlightsForQuestion = Object.entries(highlights)
      .filter(([_, h]) => h.questionId === questionId && h.isExplanation === isExplanation)
      .map(([key, h]) => ({ ...h, key }));

    if (!highlightsForQuestion.length) return text;

    highlightsForQuestion.sort((a, b) => a.start - b.start);
    let result = "";
    let lastIndex = 0;

    highlightsForQuestion.forEach((h) => {
      if (h.start >= text.length) return;
      if (h.start > lastIndex) result += text.slice(lastIndex, h.start);
      const highlightText = text.slice(h.start, Math.min(h.end, text.length));
      result += `<span class="highlight cursor-pointer text-black" data-key="${h.key}" style="background-color: ${h.color}">${highlightText}</span>`;
      lastIndex = h.end;
    });

    if (lastIndex < text.length) result += text.slice(lastIndex);
    return result;
  };

  const handleHighlightClick = (e) => {
    const key = e.target.dataset.key;
    if (key) removeHighlight(key);
  };

  const openMediaModal = (media) => {
    setMediaToShow(media);
    setShowMediaModal(true);
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const interaction = userAnswers[currentQuestionIndex] || {};
  const isSubmitted = submittedQuestions.includes(currentQuestion._id);
  const submissionResult = submissionResults[currentQuestion._id] || {};
  const showExplanation = isSubmitted && !hiddenExplanations.includes(currentQuestion._id);

  const mainContentClass = activePanel ? "w-3/5" : "w-full";
  const panelClass = activePanel ? "w-2/5" : "hidden";

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} relative`}>
      <div className={`fixed inset-y-0 left-0 w-20 ${theme === "dark" ? "bg-gray-700" : "bg-white"} shadow-lg transform ${showSidebar ? "translate-x-0" : "-translate-x-full"} transition-transform z-10`}>
        <div className="p-4">
          {questions.map((q, i) => {
            const status = userAnswers[i].selectedAnswer !== null && submittedQuestions.includes(q._id)
              ? submissionResults[q._id]?.isCorrect ? "bg-green-500" : "bg-red-500"
              : userAnswers[i].isFlagged ? "bg-yellow-500" : "bg-gray-200";
            return (
              <button
                key={q._id}
                onClick={() => {
                  setCurrentQuestionIndex(i);
                  setShowSidebar(false);
                }}
                className={`w-full p-2 mb-2 rounded ${status} ${i === currentQuestionIndex ? "ring-2 ring-blue-500" : ""} text-white`}
                aria-label={`Go to question ${i + 1}`}
              >
                {i + 1}
                {userAnswers[i].isFlagged && <Flag size={12} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`p-6 ${showSidebar ? "ml-20" : "ml-0"} flex`}>
        <div className={`${mainContentClass} transition-all duration-300`}>
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} p-6 rounded-lg shadow-lg`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <button onClick={() => setShowSidebar(!showSidebar)} className="mr-2 p-1 hover:bg-gray-200 rounded" aria-label="Toggle sidebar">
                  <Menu />
                </button>
                <h1 className="text-xl font-bold">Question {currentQuestionIndex + 1} of {questions.length}</h1>
              </div>
              <div className="flex space-x-2 items-center">
                {usePerQuestionTimer && (
                  <span className="flex items-center bg-gray-200 px-2 py-1 rounded">
                    <Clock size={16} className="mr-1" /> {formatTime(timeLeft)}
                  </span>
                )}
                <button onClick={() => setActivePanel("calculator")} className="p-1 hover:bg-gray-200 rounded" title="Calculator" aria-label="Open calculator">
                  <CalculatorIcon />
                </button>
                <button onClick={() => setActivePanel("labValues")} className="p-1 hover:bg-gray-200 rounded" title="Lab Values" aria-label="Open lab values">
                  <Beaker />
                </button>
                <button onClick={() => setActivePanel("notes")} className="p-1 hover:bg-gray-200 rounded relative" title="Notes" aria-label="Open notes">
                  <StickyNote />
                  {interaction.note && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>
                <button onClick={toggleTheme} className="p-1 hover:bg-gray-200 rounded" title="Toggle Theme" aria-label="Toggle theme">
                  {theme === "dark" ? <Sun /> : <Moon />}
                </button>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div
                className="text-lg"
                dangerouslySetInnerHTML={{ __html: renderHighlightedText(currentQuestion.questionText, currentQuestion._id) }}
                onMouseUp={(e) => handleTextSelection(e)}
                onClick={handleHighlightClick}
              />
              {currentQuestion.media?.length > 0 && (
                <button
                  onClick={() => openMediaModal(currentQuestion.media)}
                  className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  View Media
                </button>
              )}
            </div>

            {currentQuestion.options?.map((opt, i) => (
              <div key={i} className="flex items-center mb-2">
                <button
                  onClick={() => handleAnswerSelect(i)}
                  className={`p-2 mr-2 rounded ${interaction.selectedAnswer === i ? (isSubmitted ? (submissionResult.isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white") : "bg-blue-500 text-white") : "bg-gray-200"} ${isSubmitted ? "cursor-not-allowed" : "hover:bg-blue-300"}`}
                  disabled={isSubmitted}
                  aria-label={`Select option ${String.fromCharCode(65 + i)}`}
                >
                  {String.fromCharCode(65 + i)}
                  {isSubmitted && currentQuestion.correctAnswers.includes(i) && <Check size={14} className="ml-1" />}
                </button>
                <span
                  onClick={() => toggleStrike(i)}
                  className={`${struckOptions[currentQuestion._id]?.includes(i) ? "line-through text-gray-500" : ""} cursor-pointer`}
                  dangerouslySetInnerHTML={{ __html: opt.text }}
                />
                {isSubmitted && opt.media?.length > 0 && (
                  <button
                    onClick={() => openMediaModal(opt.media)}
                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View Option Media
                  </button>
                )}
              </div>
            ))}

            {!isSubmitted && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleUpdateInteraction(interaction.selectedAnswer !== null ? "submit" : "skip")}
                  className={`flex items-center px-3 py-2 rounded-lg ${interaction.selectedAnswer !== null ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"} text-white`}
                  disabled={submitting}
                  aria-label={interaction.selectedAnswer !== null ? "Submit answer" : "Skip question"}
                >
                  <span className="w-[70%]">{interaction.selectedAnswer !== null ? "Submit" : "Skip"}</span>
                  <span className="w-[30%] text-center">&gt;</span>
                </button>
                {interaction.selectedAnswer === null && (
                  <button
                    onClick={() => handleUpdateInteraction("flag")}
                    className={`ml-2 px-3 py-2 rounded-lg ${interaction.isFlagged ? "bg-yellow-600" : "bg-yellow-500"} hover:bg-yellow-600 text-white`}
                    aria-label={interaction.isFlagged ? "Unflag question" : "Flag question"}
                  >
                    {interaction.isFlagged ? "Unflag" : "Flag"}
                  </button>
                )}
              </div>
            )}

            {isSubmitted && (
              <div className="mt-4 p-2 rounded-lg bg-opacity-50 flex justify-end">
                {submissionResult.selectedAnswer !== undefined ? (
                  <div className={`p-2 rounded ${submissionResult.isCorrect ? "bg-green-200" : "bg-red-200"}`}>
                    Your answer is {submissionResult.isCorrect ? "Correct" : "Incorrect"}
                  </div>
                ) : (
                  <div className="p-2 rounded bg-gray-200">Skipped</div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleCancelTest}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                aria-label="Cancel test"
              >
                Cancel Test
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  aria-label="Previous question"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  aria-label="Next question"
                >
                  <ChevronRight />
                </button>
                <button
                  onClick={() => setShowEndModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  aria-label="End test"
                >
                  End Test
                </button>
              </div>
            </div>
          </div>

          {showExplanation && (
            <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} p-6 rounded-lg shadow-lg mt-4`}>
              <h3 className="font-bold mb-2 text-lg">Explanation</h3>
              <ul className="list-disc pl-4">
                {currentQuestion.explanation?.text.split(".").map((point, i) =>
                  point.trim() ? (
                    <li
                      key={i}
                      dangerouslySetInnerHTML={{ __html: renderHighlightedText(point.trim(), currentQuestion._id, true) }}
                      onMouseUp={(e) => handleTextSelection(e, true)}
                      onClick={handleHighlightClick}
                    />
                  ) : null
                )}
              </ul>
              {currentQuestion.explanation?.media?.length > 0 && (
                <button
                  onClick={() => openMediaModal(currentQuestion.explanation.media)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  View Explanation Media
                </button>
              )}
              <button
                onClick={() => setHiddenExplanations([...hiddenExplanations, currentQuestion._id])}
                className="mt-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className={`${panelClass} pl-4 transition-all duration-300`}>
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} p-6 rounded-lg shadow-lg h-full`}>
            {activePanel === "calculator" && <Calculator onClose={() => setActivePanel(null)} />}
            {activePanel === "labValues" && <LabValuesModal onClose={() => setActivePanel(null)} />}
            {activePanel === "notes" && (
              <div>
                <h3 className="font-bold mb-2 text-lg">Note</h3>
                <textarea
                  value={interaction.note}
                  onChange={(e) =>
                    setUserAnswers((prev) =>
                      prev.map((a, i) => (i === currentQuestionIndex ? { ...a, note: e.target.value } : a))
                    )
                  }
                  className={`w-full p-2 border rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                  placeholder="Add a note..."
                  rows="5"
                  aria-label="Note input"
                />
                <button
                  onClick={handleSaveNote}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  aria-label="Save note"
                >
                  Save
                </button>
                <button
                  onClick={() => setActivePanel(null)}
                  className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  aria-label="Close note"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showHighlightMenu && (
        <div
          ref={highlightMenuRef}
          className="fixed bg-white shadow p-2 rounded z-50"
          style={{ top: highlightPosition.y, left: highlightPosition.x }}
        >
          <button onClick={() => applyHighlight("yellow")} className="w-6 h-6 bg-yellow-300 rounded mr-1" aria-label="Highlight yellow" />
          <button onClick={() => applyHighlight("green")} className="w-6 h-6 bg-green-300 rounded mr-1" aria-label="Highlight green" />
          <button onClick={() => applyHighlight("pink")} className="w-6 h-6 bg-pink-300 rounded mr-1" aria-label="Highlight pink" />
          <button onClick={() => applyHighlight("blue")} className="w-6 h-6 bg-blue-300 rounded" aria-label="Highlight blue" />
        </div>
      )}

      {showMediaModal && (
        <MediaModal media={mediaToShow} onClose={() => setShowMediaModal(false)} />
      )}

      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} p-6 rounded-lg shadow-lg`}>
            <p>Are you sure you want to end the test? Unsubmitted questions will be skipped.</p>
            <div className="mt-4 flex space-x-2 justify-end">
              <button
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                aria-label="Cancel ending test"
              >
                Cancel
              </button>
              <button
                onClick={handleEndTest}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                aria-label="Confirm end test"
              >
                End Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRunnerPage;