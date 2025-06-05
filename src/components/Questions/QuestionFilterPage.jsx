import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { categorizedData } from "../../data/categorizedData";

export default function QuestionFilterPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(categorizedData[0]?.category || "");
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());
  const [selectedTopics, setSelectedTopics] = useState(new Map());
  const [activeSubject, setActiveSubject] = useState(null);
  const [difficulty, setDifficulty] = useState("all");
  const [questionStatusFilter, setQuestionStatusFilter] = useState("all");
  const [useTimer, setUseTimer] = useState(false);
  const [testDuration, setTestDuration] = useState("90");
  const [numberOfItems, setNumberOfItems] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [counts, setCounts] = useState({
    categories: {},
    subjects: {},
    topics: {},
    status: { all: 0, used: 0, unused: 0, correct: 0, incorrect: 0, flagged: 0 },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Theme handling
  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("storage", handleStorageChange);
    document.documentElement.classList.toggle("dark", theme === "dark");
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [theme]);

  // Reset subjects and topics on filter change
  useEffect(() => {
    setSelectedSubjects(new Set());
    setSelectedTopics(new Map());
    setActiveSubject(null);
  }, [questionStatusFilter, difficulty, selectedCategory]);

  // Build query parameters based on backend expectations
  const buildQueryParams = () => {
    const params = [];
    if (selectedCategory) params.push(`categories=${encodeURIComponent(selectedCategory)}`);
    if (difficulty !== "all") params.push(`difficulty=${encodeURIComponent(difficulty)}`);
    if (selectedSubjects.size > 0) {
      params.push(`subjects=${encodeURIComponent(Array.from(selectedSubjects).join(','))}`);
    }
    if (selectedTopics.size > 0) {
      const topics = Array.from(selectedTopics.values()).flat();
      if (topics.length > 0) params.push(`topics=${encodeURIComponent(topics.join(','))}`);
    }
    return params.length > 0 ? `?${params.join('&')}` : '';
  };

  // Fetch counts and questions
  useEffect(() => {
    const fetchCountsAndQuestions = async () => {
      setErrorMessage("");
      setIsLoading(true);
      try {
        if (!token) throw new Error("Authentication token missing. Please log in.");

        // Initialize counts
        const categoryCounts = {};
        categorizedData.forEach(cat => {
          categoryCounts[cat.category] = { all: 0, used: 0, unused: 0, correct: 0, incorrect: 0, flagged: 0 };
        });
        const subjectCounts = {};
        const topicCounts = {};

        // Fetch questions for each status
        const baseQP = buildQueryParams();
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all questions
        const allQuestionsRes = await axios.get(`http://localhost:5000/api/questions${baseQP}`, { headers });
        const allQuestions = allQuestionsRes.data || [];
        setQuestions(allQuestions);

        // Fetch used questions
        const usedQuestionsRes = await axios.get(`http://localhost:5000/api/questions${baseQP}&status=used`, { headers });
        const usedQuestions = usedQuestionsRes.data || [];

        // Fetch correct questions
        const correctQuestionsRes = await axios.get(`http://localhost:5000/api/questions${baseQP}&correct=true`, { headers });
        const correctQuestions = correctQuestionsRes.data || [];

        // Fetch incorrect questions
        const incorrectQuestionsRes = await axios.get(`http://localhost:5000/api/questions${baseQP}&correct=false`, { headers });
        const incorrectQuestions = incorrectQuestionsRes.data || [];

        // Fetch flagged questions
        const flaggedQuestionsRes = await axios.get(`http://localhost:5000/api/questions${baseQP}&flagged=true`, { headers });
        const flaggedQuestions = flaggedQuestionsRes.data || [];

        // Compute unused questions
        const usedIds = new Set(usedQuestions.map(q => q._id.toString()));
        const allIds = allQuestions.map(q => q._id.toString());
        const unusedQuestions = allQuestions.filter(q => !usedIds.has(q._id.toString()));

        // Calculate counts
        categoryCounts[selectedCategory] = {
          all: allQuestions.length,
          used: usedQuestions.length,
          unused: unusedQuestions.length,
          correct: correctQuestions.length,
          incorrect: incorrectQuestions.length,
          flagged: flaggedQuestions.length,
        };

        // Subject counts
        const subjects = [...new Set(allQuestions.flatMap(q => q.subjects))];
        subjects.forEach(subject => {
          const subjectAllQuestions = allQuestions.filter(q => q.subjects.includes(subject));
          const subjectUsedQuestions = usedQuestions.filter(q => q.subjects.includes(subject));
          const subjectCorrectQuestions = correctQuestions.filter(q => q.subjects.includes(subject));
          const subjectIncorrectQuestions = incorrectQuestions.filter(q => q.subjects.includes(subject));
          const subjectFlaggedQuestions = flaggedQuestions.filter(q => q.subjects.includes(subject));
          const subjectUnusedQuestions = subjectAllQuestions.filter(q => !usedIds.has(q._id.toString()));

          subjectCounts[subject] = {
            all: subjectAllQuestions.length,
            used: subjectUsedQuestions.length,
            unused: subjectUnusedQuestions.length,
            correct: subjectCorrectQuestions.length,
            incorrect: subjectIncorrectQuestions.length,
            flagged: subjectFlaggedQuestions.length,
          };
        });

        // Topic counts
        subjects.forEach(subject => {
          const subjectAllQuestions = allQuestions.filter(q => q.subjects.includes(subject));
          const topics = [...new Set(subjectAllQuestions.flatMap(q => q.topics))];
          topics.forEach(topic => {
            const topicAllQuestions = subjectAllQuestions.filter(q => q.topics.includes(topic));
            const topicUsedQuestions = usedQuestions.filter(q => q.subjects.includes(subject) && q.topics.includes(topic));
            const topicCorrectQuestions = correctQuestions.filter(q => q.subjects.includes(subject) && q.topics.includes(topic));
            const topicIncorrectQuestions = incorrectQuestions.filter(q => q.subjects.includes(subject) && q.topics.includes(topic));
            const topicFlaggedQuestions = flaggedQuestions.filter(q => q.subjects.includes(subject) && q.topics.includes(topic));
            const topicUnusedQuestions = topicAllQuestions.filter(q => !usedIds.has(q._id.toString()));

            topicCounts[`${subject}||${topic}`] = {
              all: topicAllQuestions.length,
              used: topicUsedQuestions.length,
              unused: topicUnusedQuestions.length,
              correct: topicCorrectQuestions.length,
              incorrect: topicIncorrectQuestions.length,
              flagged: topicFlaggedQuestions.length,
            };
          });
        });

        setCounts({
          categories: categoryCounts,
          subjects: subjectCounts,
          topics: topicCounts,
          status: categoryCounts[selectedCategory],
        });
      } catch (err) {
        setErrorMessage(err.message || "Failed to load data. Please try again.");
        setCounts({
          categories: {},
          subjects: {},
          topics: {},
          status: { all: 0, used: 0, unused: 0, correct: 0, incorrect: 0, flagged: 0 },
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCategory) fetchCountsAndQuestions();
  }, [selectedCategory, questionStatusFilter, difficulty, selectedSubjects, selectedTopics]);

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(subject)) {
        newSelection.delete(subject);
        setSelectedTopics(prevTopics => {
          const newTopics = new Map(prevTopics);
          newTopics.delete(subject);
          return newTopics;
        });
      } else {
        newSelection.add(subject);
      }
      setActiveSubject(newSelection.size > 0 ? subject : null);
      return newSelection;
    });
  };

  const toggleTopic = (topic, subject) => {
    setSelectedTopics(prev => {
      const newTopics = new Map(prev);
      const subjectTopics = newTopics.get(subject) || [];
      if (subjectTopics.includes(topic)) {
        newTopics.set(subject, subjectTopics.filter(t => t !== topic));
      } else {
        newTopics.set(subject, [...subjectTopics, topic]);
      }
      if (newTopics.get(subject).length === 0) newTopics.delete(subject);
      return newTopics;
    });
  };

 const startTest = async () => {
  if (selectedSubjects.size === 0 || questions.length === 0) {
    setErrorMessage("Select at least one subject with available questions");
    return;
  }

  setIsLoading(true);
  setErrorMessage("");
  try {
    if (!token) throw new Error("Authentication token missing. Please log in.");

    // Define maxQuestions based on user input and constraints
    const maxQuestions = Math.min(numberOfItems, questions.length, 50);

    // Payload without duration
    const payload = {
      categories: [selectedCategory],
      subjects: Array.from(selectedSubjects),
      topics: Array.from(selectedTopics.values()).flat(),
      count: maxQuestions,
    };

    // Send request to create test
    const res = await axios.post("http://localhost:5000/api/tests", payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    const { testId, questionIds } = res.data;
    if (!testId || !questionIds) {
      throw new Error("Invalid test creation response");
    }

    // Filter locally fetched questions to match backend-selected questionIds
    const selectedQuestions = questions.filter(q => questionIds.includes(q._id));
    if (selectedQuestions.length !== questionIds.length) {
      throw new Error("Mismatch in selected questions; some questions may not be available locally");
    }

    // Prepare test data for the test runner
    const testData = {
      testSessionId: testId,
      questions: selectedQuestions,
      testDuration: useTimer ? parseInt(testDuration) : 0,
      selectedFilters: {
        category: selectedCategory,
        subjects: Array.from(selectedSubjects),
        topics: Array.from(selectedTopics.entries()).reduce((acc, [subject, topics]) => ({ ...acc, [subject]: topics }), {}),
        difficulty,
        questionStatus: questionStatusFilter,
      },
    };

    // Store test data and navigate
    sessionStorage.setItem("testData", JSON.stringify(testData));
    navigate("/test-runner", { state: testData });
  } catch (error) {
    setErrorMessage(error.message || "Failed to start test. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {errorMessage && (
        <div className="mx-4 mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
          {errorMessage.includes("token") && (
            <button onClick={() => navigate("/login")} className="mt-2 text-blue-600 dark:text-blue-400 hover:underline">
              Log in
            </button>
          )}
        </div>
      )}

      <div className="p-4 md:p-6 lg:p-8">
        {/* Status and Difficulty Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Question Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { value: "all", label: `All (Q${counts.status.all || 0})` },
                { value: "used", label: `Used (Q${counts.status.used || 0})` },
                { value: "unused", label: `Unused (Q${counts.status.unused || 0})` },
                { value: "correct", label: `Correct (Q${counts.status.correct || 0})` },
                { value: "incorrect", label: `Incorrect (Q${counts.status.incorrect || 0})` },
                { value: "flagged", label: `Flagged (Q${counts.status.flagged || 0})` },
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setQuestionStatusFilter(filter.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    questionStatusFilter === filter.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Difficulty</h3>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All (Q{counts.status.all || 0})</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Select Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categorizedData.map(cat => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`py-3 px-4 rounded-lg text-center font-medium transition-all duration-200 ${
                  selectedCategory === cat.category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {cat.category} (Q{counts.categories[cat.category]?.[questionStatusFilter] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selection */}
        {selectedCategory && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Select Subjects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categorizedData
                .find(cat => cat.category === selectedCategory)
                ?.subjects.map(subject => {
                  const count = counts.subjects[subject.name]?.[questionStatusFilter] || 0;
                  const isSelected = selectedSubjects.has(subject.name);
                  return (
                    <label
                      key={subject.name}
                      className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : count === 0
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={count === 0}
                        onChange={() => toggleSubject(subject.name)}
                        className="hidden"
                      />
                      <span className="flex-1">{subject.name}</span>
                      <span className={`font-semibold ${count > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                        Q{count}
                      </span>
                    </label>
                  );
                })}
            </div>
          </div>
        )}

        {/* Topic Selection */}
        {selectedSubjects.size > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Select Topics (Optional)</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Leave topics unselected to include all topics from selected subjects
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              {Array.from(selectedSubjects).map(subject => (
                <button
                  key={subject}
                  onClick={() => setActiveSubject(subject)}
                  className={`py-2 px-4 rounded-lg transition-all duration-200 ${
                    activeSubject === subject
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
            {activeSubject && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categorizedData
                  .find(cat => cat.category === selectedCategory)
                  ?.subjects.find(s => s.name === activeSubject)
                  ?.topics.map(topic => {
                    const key = `${activeSubject}||${topic}`;
                    const count = counts.topics[key]?.[questionStatusFilter] || 0;
                    const isSelected = (selectedTopics.get(activeSubject) || []).includes(topic);
                    return (
                      <label
                        key={key}
                        className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : count === 0
                            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={count === 0}
                          onChange={() => toggleTopic(topic, activeSubject)}
                          className="hidden"
                        />
                        <span className="flex-1">{topic}</span>
                        <span className={`font-semibold ${count > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                          Q{count}
                        </span>
                      </label>
                    );
                  })}
              </div>
            )}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Selected Filters</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedSubjects).map(subject => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                  >
                    {subject}
                    {selectedTopics.get(subject)?.length > 0 ? ` → ${selectedTopics.get(subject).join(", ")}` : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Question Count and Test Config */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Available Questions</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {questions.length} questions available with current filters
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {Math.min(numberOfItems, questions.length, 50)} questions selected for the test
            {numberOfItems > questions.length && (
              <span className="text-orange-500 dark:text-orange-400 ml-2">
                (Requested {numberOfItems}, only {questions.length} available)
              </span>
            )}
            {numberOfItems > 50 && (
              <span className="text-orange-500 dark:text-orange-400 ml-2">
                (Limited to 50 questions maximum)
              </span>
            )}
          </p>
        </div>

        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Test Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setUseTimer(!useTimer)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  useTimer ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label="Toggle timer"
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                    useTimer ? "left-[calc(100%-1.25rem)]" : "left-0.5"
                  }`}
                ></span>
              </button>
              <label className="text-gray-800 dark:text-gray-200">Use timer</label>
              {useTimer && (
                <input
                  type="number"
                  value={testDuration}
                  onChange={e => setTestDuration(e.target.value || "90")}
                  className="w-24 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  min="10"
                  max="3600"
                  placeholder="Seconds"
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Number of Questions</h3>
              <input
                type="number"
                value={numberOfItems}
                onChange={e => setNumberOfItems(Math.max(1, Math.min(parseInt(e.target.value) || 1, 50)))}
                className="w-24 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                min="1"
                max="50"
              />
              {questions.length > 0 && numberOfItems > questions.length && (
                <p className="text-sm text-orange-500 dark:text-orange-400 mt-1">
                  Max available: {questions.length}
                </p>
              )}
              {numberOfItems > 50 && (
                <p className="text-sm text-orange-500 dark:text-orange-400 mt-1">
                  Max allowed: 50
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </button>
          <button
            onClick={startTest}
            disabled={isLoading || selectedSubjects.size === 0 || questions.length === 0}
            className={`py-2 px-6 rounded-lg transition-all duration-200 ${
              selectedSubjects.size > 0 && questions.length > 0
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading
              ? "Starting..."
              : `Start Test (${Math.min(numberOfItems, questions.length, 50)} questions)`}
          </button>
        </div>
      </div>
    </div>
  );
}