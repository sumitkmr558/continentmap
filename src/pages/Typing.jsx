import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  LinearProgress,
} from "@mui/material";

function generateLine() {
  return Array(10).fill("asdf ;lkj").join(" ");
}
const testLines = Array(10).fill(null).map(generateLine);

function getCurrentIndices(line, input) {
  let charsSeen = 0;
  const words = line.split(" ");
  let cursor = input.length;
  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    if (cursor <= word.length) {
      return { wordIdx: w, letterIdx: cursor };
    }
    cursor -= word.length + 1; // +1 for space
  }
  return {
    wordIdx: words.length - 1,
    letterIdx: words[words.length - 1].length,
  };
}

function scoreLine(target, input) {
  let correct = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === target[i]) correct++;
  }
  return {
    correct,
    total: target.length,
    percent: ((correct / target.length) * 100).toFixed(1),
  };
}

function wpm(characters, seconds) {
  return seconds > 0 ? (characters / 5 / (seconds / 60)).toFixed(2) : "0";
}

export default function Typing() {
  const [currentLine, setCurrentLine] = useState(0);
  const [inputs, setInputs] = useState(Array(10).fill(""));
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [report, setReport] = useState(null);
  const inputRef = useRef();

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isStarted && !isFinished) {
      interval = setInterval(() => setTimer(Date.now() - startTime), 100);
    }
    return () => clearInterval(interval);
  }, [isStarted, isFinished, startTime]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentLine, isFinished]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      setStartTime(Date.now());
    }
    if (value.length <= testLines[currentLine].length) {
      const newInputs = [...inputs];
      newInputs[currentLine] = value;
      setInputs(newInputs);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isFinished) {
      e.preventDefault();
      handleNextLineOrSubmit();
    }
  };

  const handleNextLineOrSubmit = () => {
    if (inputs[currentLine].length !== testLines[currentLine].length) return;
    if (currentLine < 9) {
      setCurrentLine(currentLine + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsFinished(true);
    setIsStarted(false);
    const elapsedSec = (Date.now() - startTime) / 1000;
    let totalCorrect = 0;
    let totalChars = 0;
    let totalTyped = 0;
    for (let i = 0; i < 10; i++) {
      const { correct, total } = scoreLine(testLines[i], inputs[i]);
      totalCorrect += correct;
      totalChars += total;
      totalTyped += inputs[i].length;
    }
    setReport({
      accuracy: ((totalCorrect / totalChars) * 100).toFixed(1),
      wpm: wpm(totalTyped, elapsedSec),
      time: elapsedSec.toFixed(2),
      totalCorrect,
      totalChars,
    });
  };

  const handleRestart = () => {
    setInputs(Array(10).fill(""));
    setCurrentLine(0);
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setTimer(0);
    setReport(null);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  };

  function renderHighlightedLine(line, input, finished) {
    const words = line.split(" ");
    const { wordIdx, letterIdx } = getCurrentIndices(line, input);

    let globalChar = 0;
    let inputArr = input.split("");

    return (
      <Box sx={{ fontSize: 22, fontFamily: "monospace", userSelect: "none" }}>
        {words.map((word, wi) => {
          const isCurrentWord = !finished && wi === wordIdx;
          let wordEls = [];

          for (let li = 0; li < word.length; li++) {
            const isCurrentLetter =
              !finished && wi === wordIdx && li === letterIdx;
            let charColor = "#222";
            if (inputArr[globalChar] && inputArr[globalChar] !== word[li])
              charColor = "#d32f2f";
            if (isCurrentLetter) charColor = "#1976d2";
            wordEls.push(
              <span
                key={li}
                style={{
                  fontWeight: isCurrentLetter ? "bold" : "normal",
                  color: charColor,
                  background: isCurrentLetter ? "#bbdefb" : "",
                  borderRadius: 3,
                  padding: "1px 2px",
                }}
              >
                {word[li]}
              </span>
            );
            globalChar++;
          }

          // Add space after word (except last word)
          if (wi < words.length - 1) {
            const isCurrentSpace =
              !finished && wi === wordIdx && letterIdx === word.length;
            let spaceColor = "#222";
            if (inputArr[globalChar] && inputArr[globalChar] !== " ")
              spaceColor = "#d32f2f";
            if (isCurrentSpace) spaceColor = "#1976d2";
            wordEls.push(
              <span
                key="space"
                style={{
                  fontWeight: isCurrentSpace ? "bold" : "normal",
                  color: spaceColor,
                  background: isCurrentSpace ? "#bbdefb" : "",
                  borderRadius: 3,
                  padding: "1px 2px",
                }}
              >
                &nbsp;
              </span>
            );
            globalChar++;
          }

          // Wrap word with highlight if it's the current word
          return (
            <span
              key={wi}
              style={{
                background: isCurrentWord ? "#e3f2fd" : "transparent",
                borderRadius: 4,
                marginRight: 4,
                padding: "0 2px",
                display: "inline-block",
              }}
            >
              {wordEls}
            </span>
          );
        })}
      </Box>
    );
  }

  // Only enable next/submit when the current line is fully typed
  const currentLineFilled =
    inputs[currentLine].length === testLines[currentLine].length;

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Typing Tutor: asdf ;lkj Practice
        </Typography>
        <Typography align="center" sx={{ mb: 2 }}>
          Type each line, the <b>current letter and word are highlighted</b>.
          Timer runs as you type.
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(currentLine / 10) * 100}
          sx={{ mb: 4, height: 10, borderRadius: 5 }}
        />
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          {isStarted && !isFinished ? (
            <>
              Timer: <b>{(timer / 1000).toFixed(1)}s</b>
            </>
          ) : isFinished && report ? (
            <>
              Time: <b>{report.time}s</b>
            </>
          ) : (
            <>
              Timer: <b>0.0s</b>
            </>
          )}
        </Typography>
        {!isFinished && (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Line {currentLine + 1} of 10
            </Typography>
            <Box
              sx={{
                mb: 2,
                p: 2,
                minHeight: 52,
                background: "#f5f5f5",
                borderRadius: 2,
                fontFamily: "monospace",
                overflowX: "auto",
                fontSize: 22,
                letterSpacing: 1.5,
              }}
            >
              {renderHighlightedLine(
                testLines[currentLine],
                inputs[currentLine],
                isFinished
              )}
            </Box>
            <TextField
              inputRef={inputRef}
              fullWidth
              variant="outlined"
              value={inputs[currentLine]}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder={`Type line ${
                currentLine + 1
              } and press Enter for next`}
              inputProps={{
                maxLength: testLines[currentLine].length,
                style: {
                  fontFamily: "monospace",
                  fontSize: 18,
                  letterSpacing: 1.5,
                },
                spellCheck: "false",
              }}
              sx={{ mb: 2, bgcolor: "#fff" }}
              disabled={isFinished}
            />
            <Box textAlign="center" sx={{ mt: 2 }}>
              {currentLine < 9 ? (
                <Button
                  variant="contained"
                  color={currentLineFilled ? "primary" : "inherit"}
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontSize: 18,
                    mt: 1,
                    backgroundColor: currentLineFilled ? undefined : "#ddd",
                  }}
                  onClick={handleNextLineOrSubmit}
                  disabled={!currentLineFilled}
                >
                  Next Line
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color={currentLineFilled ? "primary" : "inherit"}
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontSize: 18,
                    mt: 1,
                    backgroundColor: currentLineFilled ? "#1976d2" : "#ddd",
                    color: currentLineFilled ? "#fff" : "#888",
                    boxShadow: currentLineFilled
                      ? "0 0 12px #1976d266"
                      : "none",
                  }}
                  onClick={handleSubmit}
                  disabled={!currentLineFilled}
                >
                  Submit
                </Button>
              )}
              <Button
                variant="outlined"
                color="secondary"
                sx={{ px: 5, py: 1.5, fontSize: 18, mt: 1, ml: 2 }}
                onClick={handleRestart}
              >
                Restart
              </Button>
            </Box>
          </>
        )}
        {isFinished && report && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              <b>Report</b>
            </Typography>
            <Typography variant="body1">
              <b>Time:</b> {report.time} seconds
            </Typography>
            <Typography variant="body1">
              <b>Accuracy:</b> {report.accuracy}%
            </Typography>
            <Typography variant="body1">
              <b>WPM:</b> {report.wpm}
            </Typography>
            <Typography variant="body1">
              <b>Correct Characters:</b> {report.totalCorrect} /{" "}
              {report.totalChars}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ px: 5, py: 1.5, fontSize: 18, mt: 3 }}
              onClick={handleRestart}
            >
              Restart
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
