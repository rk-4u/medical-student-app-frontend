import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import MediaDisplay from "../Media/MediaDisplay";

const MyCreatedQuestionsPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const token = localStorage.getItem("token");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("https://medical-student-app-backend.onrender.com/api/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else {
          alert("Failed to load questions.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [token, navigate]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} p-4`}>
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
        <h1 className="text-2xl font-bold mb-6">My Created Questions</h1>
        {questions.length === 0 ? (
          <p>No questions created yet.</p>
        ) : (
          questions.map((q, i) => (
            <div key={q._id} className="mb-6 p-4 border rounded-lg">
              <p className="font-semibold text-lg">Q{i + 1}: {q.questionText}</p>
              {q.media?.map((m, j) => <MediaDisplay key={j} media={m} />)}
              <div className="mt-2">
                {q.options.map((opt, j) => (
                  <div key={j} className="flex items-center">
                    <span className={`mr-2 p-1 rounded ${q.correctAnswers.includes(j) ? "bg-green-100" : ""}`}>
                      {String.fromCharCode(65 + j)}. {opt.text}
                    </span>
                    {opt.media?.map((m, k) => <MediaDisplay key={k} media={m} />)}
                  </div>
                ))}
              </div>
              <p className="mt-2">Correct Answer(s): {q.correctAnswers.map((a) => String.fromCharCode(65 + a)).join(", ")}</p>
              <p className="mt-2">Explanation: {q.explanation.text}</p>
              {q.explanation.media?.map((m, j) => <MediaDisplay key={j} media={m} />)}
              <p className="mt-2">Categories: {q.categories.join(", ")}</p>
              <p>Subjects: {q.subjects.join(", ")}</p>
              <p>Topics: {q.topics.join(", ")}</p>
              <p>Difficulty: {q.difficulty}</p>
              <p>Source URL: {q.sourceUrl || "N/A"}</p>
            </div>
          ))
        )}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MyCreatedQuestionsPage;