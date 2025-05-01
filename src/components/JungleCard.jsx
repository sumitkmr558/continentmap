import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

// This component expects `current` = { name, img, fact }
// And `showFact` = true/false

const JungleCard = ({ current, showFact }) => {
  return (
    <Card
      sx={{
        maxWidth: 360,
        mx: "auto",
        my: 4,
        borderRadius: 4,
        boxShadow: 8,
        backgroundColor: "#e0f2f1",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", p: 2, bgcolor: "#a5d6a7" }}>
        <motion.img
          src={current.img}
          alt={current.name}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "12px",
            filter: showFact ? "none" : "blur(5px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        />
      </Box>

      <CardContent>
        <Typography
          variant="h6"
          align="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          {current.name}
        </Typography>
        {showFact && (
          <Typography variant="body2" align="center" color="text.secondary">
            {current.fact}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default JungleCard;
