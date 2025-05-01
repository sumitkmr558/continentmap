import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Stack,
  CardActions,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import useSound from "use-sound";
import confetti from "canvas-confetti";
import Lottie from "lottie-react";
import explorerAnim from "../lottie/explorer.json";
import successSfx from "../sounds/success.mp3";
import failSfx from "../sounds/fail.mp3";
import ambientSfx from "../sounds/jungle_ambient.mp3";
import JungleCard from "../components/JungleCard";

const questions = [
  {
    clue: "I have eight arms. I protect myself by ejecting ink at my attackers.",
    answer: "octopus",
    img: `${process.env.PUBLIC_URL}/images/octopus.png`,
    fact: "Octopuses have three hearts and blue blood!",
  },
  {
    clue: "I have a duck-like bill. I am featured on the 20-cent coin of Australia.",
    answer: "platypus",
    img: `${process.env.PUBLIC_URL}/images/platypus.png`,
    fact: "The platypus can detect electrical signals underwater!",
  },
  {
    clue: "I resemble a teddy bear and live in Australia. I eat eucalyptus leaves.",
    answer: "koala",
    img: `${process.env.PUBLIC_URL}/images/koala.jpg`,
    fact: "Koalas sleep around 20 hours a day!",
  },
  {
    clue: "I am a long-haired, intelligent ape from Indonesia and Malaysia.",
    answer: "orangutan",
    img: `${process.env.PUBLIC_URL}/images/orangutan.png`,
    fact: "Orangutans use tools and are very smart!",
  },
  {
    clue: "I am a flightless bird from New Zealand. A fruit is named after me.",
    answer: "kiwi",
    img: `${process.env.PUBLIC_URL}/images/kiwi.png`,
    fact: "Kiwis have nostrils at the end of their beaks!",
  },
  {
    clue: "I am the only snake that builds a nest. I hiss like a growling dog.",
    answer: "king cobra",
    img: `${process.env.PUBLIC_URL}/images/king_cobra.png`,
    fact: 'The king cobra can "stand up" and look a person in the eye!',
  },
];

export default function GuessMyNameGame() {
  const [wrongAnswerShown, setWrongAnswerShown] = useState(false);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [playSuccess] = useSound(successSfx);
  const [playFail] = useSound(failSfx);
  const [playAmbient] = useSound(ambientSfx, { loop: true, volume: 0.3 });
  const [status, setStatus] = useState(false);

  const current = questions[index];

  React.useEffect(() => {
    playAmbient();
  }, []);

  const resetGame = () => {
    setIndex(0);
    setGuess("");
    setScore(0);
    setShowFact(false);
    setWrongAnswerShown(false); // if you added that earlier
    setStatus(false);
  };

  const checkAnswer = () => {
    const isCorrect =
      guess.trim().toLowerCase() === current.answer.toLowerCase();
    if (isCorrect) {
      playSuccess();
      confetti();
      setStatus(true);
      setScore(score + 1);
      setShowFact(true);
      setTimeout(() => {
        setShowFact(false);
        setStatus(false);
        setIndex(index + 1);
        setGuess("");
      }, 3000);
    } else {
      playFail();
      setShowFact(true);
      setWrongAnswerShown(true); // Show correct answer
      setStatus(true);
      setTimeout(() => {
        setWrongAnswerShown(false);
        setStatus(false);
        setShowFact(false);
        setIndex(index + 1);
        setGuess("");
      }, 3000);
    }
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: explorerAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (index >= questions.length) {
    return (
      <Container sx={{ mt: 8 }}>
        <Card
          className="card_primary"
          sx={{ maxWidth: "640px", margin: "auto" }}
        >
          <CardHeader title={"Guess My Name Quest Complete!"} />
          <CardContent>
            <Typography>
              You discovered {score} out of {questions.length} animals! 🏆
              Achievement:{" "}
              {score <= 2
                ? "🥉 Jungle Beginner"
                : score <= 4
                ? "🥈 Explorer"
                : "🥇 Jungle Master"}{" "}
              🏆
            </Typography>
            <Typography></Typography>
          </CardContent>
          <CardActions>
            <Stack
              direction="row"
              width="100%"
              sx={{ justifyContent: "space-between", alignItems: "Center" }}
            >
              <Stack direction="row" spacing={3}>
                📍 Progress: {index}/{questions.length} | ⭐ Score: {score}
              </Stack>

              <Button type="button" variant="contained" onClick={resetGame}>
                Restart Game
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Container sx={{ mt: 8 }}>
        <Card
          className="card_primary"
          sx={{ maxWidth: "640px", margin: "auto" }}
        >
          <CardHeader title={"Guess MY Name"} />
          <CardContent>
            <div className="mb-4 w-32">
              <Lottie options={lottieOptions} height={100} width={100} />
            </div>
            <motion.div
              className="bg-white p-4 rounded-xl shadow-xl ring ring-green-400 mb-4 text-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  padding: 4,
                  borderRadius: "1rem",
                  boxShadow: 3,
                  border: "2px solid #66bb6a", // Green ring border
                  marginBottom: 4,
                  fontSize: "1.25rem", // Text size: 1.25rem is equivalent to 'text-xl'
                }}
              >
                🧭 Clue {index + 1}: “{current.clue}”
              </Box>
            </motion.div>
            <Box
              sx={{
                height: 300,
                width: 440,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: 3,
                backgroundColor: "#f0fff0",
              }}
            >
              <motion.img
                src={current.img}
                alt="animal"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  filter: showFact ? "none" : "blur(4px)",
                }}
                // className={`h-48 mb-4 ${showFact ? "" : "blur-md"}`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </Box>

            <TextField
              type="string"
              value={guess}
              disabled={status}
              sx={{
                "& .MuiInputBase-root": {
                  height: 40, // ← change this value to your desired height
                  mb: 2,
                  mt: 2,
                },
              }}
              variant="outlined"
              placeholder="Who am I"
              fullWidth
              onChange={(e) => setGuess(e.target.value)}
            />
            {wrongAnswerShown && (
              <motion.div
                className="mt-4 bg-red-100 p-3 rounded shadow-lg text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ❌ Correct Answer: <strong>{current.answer}</strong>
              </motion.div>
            )}
            {showFact && (
              <motion.div
                className="mt-4 bg-yellow-100 p-3 rounded shadow-lg text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                🧠 Fun Fact: {current.fact}
              </motion.div>
            )}
          </CardContent>

          <CardActions>
            <Stack
              direction="row"
              width="100%"
              sx={{ justifyContent: "space-between", alignItems: "Center" }}
            >
              <Stack direction="row" spacing={3}>
                📍 Progress: {index + 1}/{questions.length} | ⭐ Score: {score}
              </Stack>

              <Button
                type="submit"
                variant="contained"
                disabled={status}
                onClick={checkAnswer}
              >
                Submit
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
