import React, { useState, useEffect, useRef } from "react";

const Typing = () => {
  // Core lesson content
  const lessons = [
    "asdf ;lkj",
    "as df ;l kj",
    "asdf ;lkj asdf ;lkj",
    "a s d f ; l k j",
    "asdf jkl; asdf jkl;",
  ];

  // State management
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef(null);

  // Current lesson text
  const currentLesson = lessons[currentLessonIndex];

  // Focus input field on load
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Handle typing logic
  const handleInput = (e) => {
    const text = e.target.value;

    // Start timer on first keystroke
    if (!startTime) setStartTime(Date.now());

    setUserInput(text);

    // Calculate accuracy
    const correctChars = text
      .split("")
      .filter((char, i) => char === currentLesson[i]).length;

    setAccuracy(Math.round((correctChars / text.length) * 100) || 100);

    // Check lesson completion
    if (text.length === currentLesson.length) {
      calculateWPM();
      setIsCompleted(true);
    }
  };

  // Calculate words per minute
  const calculateWPM = () => {
    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordsTyped = userInput.trim().length / 5;
    setWpm(Math.round(wordsTyped / timeInMinutes));
  };

  // Reset for new lesson
  const resetLesson = () => {
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    inputRef.current.focus();
  };

  // Move to next lesson
  const nextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
      resetLesson();
    }
  };

  // Render character highlighting
  const renderLessonText = () => {
    return currentLesson.split("").map((char, index) => {
      let color = "black";
      if (index < userInput.length) {
        color = userInput[index] === char ? "green" : "red";
      }
      return (
        <span key={index} style={{ color, fontSize: "1.5rem" }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
        fontFamily: "monospace",
      }}
    >
      <h1>Home Row Typing Tutor</h1>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          minHeight: "80px",
          marginBottom: "20px",
        }}
      >
        {renderLessonText()}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInput}
        disabled={isCompleted}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "1.2rem",
          textAlign: "center",
          letterSpacing: "3px",
        }}
      />

      <div style={{ margin: "20px 0" }}>
        <p>
          Accuracy: {accuracy}% | WPM: {wpm}
        </p>
        <p>
          Lesson {currentLessonIndex + 1} of {lessons.length}
        </p>
      </div>

      {isCompleted && (
        <div>
          <button onClick={resetLesson} style={buttonStyle}>
            Practice Again
          </button>
          {currentLessonIndex < lessons.length - 1 && (
            <button
              onClick={nextLesson}
              style={{ ...buttonStyle, marginLeft: "10px" }}
            >
              Next Lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Button styling
const buttonStyle = {
  padding: "10px 20px",
  fontSize: "1rem",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Typing;
