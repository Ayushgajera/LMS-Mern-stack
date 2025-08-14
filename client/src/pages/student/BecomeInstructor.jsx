import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch hook
import axios from 'axios';
import { fetchUser } from '@/features/authslice';

const QUESTIONS = [
  {
    question: "How many years of teaching experience do you have?",
    options: ["0-1 years", "2-3 years", "4-6 years", "7+ years"],
  },
  {
    question: "What is your primary area of expertise?",
    options: ["Web Development", "Data Science", "Design", "Business", "Other"],
  },
  {
    question: "What motivates you to become an instructor?",
    options: [
      "Share knowledge",
      "Earn money",
      "Build personal brand",
      "Help others grow",
      "Other"
    ],
  },
];

function BecomeInstructor() {
  // Initialize useDispatch hook to get the dispatch function
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check onboarding status from backend
  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/user/instructor-onboard', { withCredentials: true })
      .then(res => {
        if (res.data.onboarded) {
          navigate('/admin/courses', { replace: true });
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleOptionClick = (option) => {
    const newAnswers = [...answers];
    newAnswers[step] = option;
    setAnswers(newAnswers);
  };

  const handleContinue = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Save to backend
      try {
        // Changed to a relative path to match the GET request in useEffect
        await axios.post('http://localhost:8000/api/v1/user/instructor-onboard', { answers }, { withCredentials: true });
        // Dispatch the fetchUser action after a successful submission
        dispatch(fetchUser());
        navigate('/admin/courses', { replace: true });
      } catch (err) {
        // Replaced alert with console.error for better error handling in the dev environment
        console.error('Failed to save your answers. Please try again.', err);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">Become an Instructor</h2>
        <div className="mb-6">
          <div className="text-lg font-semibold mb-4">{QUESTIONS[step].question}</div>
          <div className="flex flex-col gap-3">
            {QUESTIONS[step].options.map(option => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`px-4 py-3 rounded-lg border text-left font-medium transition
                  ${answers[step] === option
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleContinue}
            disabled={answers[step] === null}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold disabled:opacity-50"
          >
            {step === QUESTIONS.length - 1 ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BecomeInstructor;
