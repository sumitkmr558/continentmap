import React, { useState } from "react";
import { Container, Box, Typography, Stack, Button } from "@mui/material";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion } from "framer-motion"; // 🪄 smooth animation library
import geoUrl from "./continents.json";

// const geoUrl = "continents.json";

const continentsData = [
  { name: "Africa", color: "red", tcolor: "black" },
  { name: "Asia", color: "blue", tcolor: "white" },
  { name: "Europe", color: "green", tcolor: "black" },
  { name: "North America", color: "yellow", tcolor: "black" },
  { name: "South America", color: "purple", tcolor: "white" },
  { name: "Australia", color: "orange", tcolor: "black" },
  { name: "Antarctica", color: "pink", tcolor: "black" },
];

export default function AnimatedMapComponent() {
  const [highlighted, setHighlighted] = useState(null);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        border: "1px solid #f1f5fa", // light border
        borderRadius: 5, // slightly rounded corners
        backgroundColor: "#f1f5fa", // very light grey background
        boxShadow: 1, // soft shadow
        mt: 1,
        mb: 2,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        World Continents Map
      </Typography>

      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={2}
        justifyContent="center"
        mb={4}
      >
        {continentsData.map((c) => (
          <Button
            key={c.name}
            variant="contained"
            onClick={() => setHighlighted(c.name)}
            sx={{
              backgroundColor: c.color,
              color: c.tcolor,
              "&:hover": {
                backgroundColor: c.color,
                opacity: 0.8,
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {c.name}
          </Button>
        ))}
        <Button
          variant="contained"
          onClick={() => setHighlighted(null)}
          sx={{
            backgroundColor: "#888",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#666",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Clear
        </Button>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <ComposableMap width={800} height={500}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const continentName = geo.properties.CONTINENT;
                const info = continentsData.find(
                  (c) => c.name === continentName
                );
                const isHighlighted = highlighted === continentName;

                return (
                  <motion.g
                    key={geo.rsmKey}
                    whileHover={{ scale: 1.05, cursor: "pointer" }} // 📍 hover effect
                    transition={{ duration: 0.3 }}
                  >
                    <Geography
                      geography={geo}
                      fill={isHighlighted && info ? info.color : "#D3D3D3"}
                      stroke="#555"
                      strokeWidth={0.5}
                    />
                  </motion.g>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </Box>
    </Container>
  );
}
