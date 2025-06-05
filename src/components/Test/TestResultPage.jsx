import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import MediaDisplay from "../Media/MediaDisplay";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const TestResultPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const token = localStorage.getItem("token");
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`https://medical-student-app-backend.onrender.com/api/tests/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTest(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else {
          alert("Failed to load test results.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [testId, token, navigate]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!test) return <div className="p-4">No results available.</div>;

  const { analytics = {}, questions = [] } = test;
  const { correct = 0, incorrect = 0, notAttempted = 0, flagged = 0, byCategory = [], bySubject = [], byTopic = [] } = analytics;

  const scoreData = {
    labels: ["Correct", "Incorrect", "Not Attempted", "Flagged"],
    datasets: [{
      label: "Test Performance",
      data: [correct, incorrect, notAttempted, flagged],
      backgroundColor: ["#4CAF50", "#F44336", "#9E9E9E", "#FFCA28"],
    }],
  };

  const categoryData = {
    labels: byCategory.map((c) => c.category),
    datasets: [{
      label: "Correct Answers by Category",
      data: byCategory.map((c) => c.correct),
      backgroundColor: "#4CAF50",
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" }, title: { display: true } },
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} flex p-4`}>
      <div className="w-2/5 mr-4">
        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
          <h1 className="text-2xl font-bold mb-4">Test Analytics</h1>
          <p className="text-lg mb-4">Score: {correct} / {questions.length}</p>
          <div style={{ width: '250px', height: '250px' }}>
            <Pie
              data={scoreData}
              options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: "Overall Performance" } } }}
            />
          </div>
          <h2 className="text-xl font-semibold mt-6 mb-2">By Category</h2>
          <div style={{ width: '250px', height: '250px' }}>
            <Bar
              data={categoryData}
              options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: "Category Breakdown" } } }}
            />
          </div>
          <h2 className="text-xl font-semibold mt-6 mb-2">By Subject</h2>
          {bySubject.map((s, i) => (
            <p key={i}>{s.subject}: {s.correct} / {s.total}</p>
          ))}
          <h2 className="text-xl font-semibold mt-6 mb-2">By Topic</h2>
          {byTopic.map((t, i) => (
            <p key={i}>{t.topic}: {t.correct} / {t.total}</p>
          ))}
        </div>
      </div>

      <div className="w-3/5">
        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
          <h2 className="text-2xl font-bold mb-4">Attempted Questions</h2>
          {questions.map((q, i) => {
            const interaction = q.userInteraction || {};
            const isCorrect = interaction.isCorrect;
            return (
              <div key={q._id} className="mb-4 p-2 border-b">
                <p className="font-semibold text-lg">Q{i + 1}: {q.questionText}</p>
                {q.media?.map((m, j) => <MediaDisplay key={j} media={m} />)}
                {q.options.map((opt, j) => (
                  <div key={j} className="flex items-center">
                    <span
                      className={`mr-2 p-1 rounded ${interaction.selectedAnswer === j ? (isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white") : q.correctAnswers.includes(j) ? "bg-green-100" : ""}`}
                    >
                      {String.fromCharCode(65 + j)}. {opt.text}
                      {q.correctAnswers.includes(j) && <Check size={14} className="ml-1 inline" />}
                    </span>
                    {opt.media?.map((m, k) => <MediaDisplay key={k} media={m} />)}
                  </div>
                ))}
                <p className="mt-2">Explanation: {q.explanation.text}</p>
                {q.explanation.media?.map((m, j) => <MediaDisplay key={j} media={m} />)}
              </div>
            );
          })}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            aria-label="Return to dashboard"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;