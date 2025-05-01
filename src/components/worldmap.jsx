import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import worldgeojson from "../world.geojson";
import countriesData from "../country.json";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Container,
  Paper,
} from "@mui/material";

const WorldMap = () => {
  const [info, setInfo] = useState(null);
  console.log(info);

  const handleClick = (country) => {
    console.log("Click event triggered:", country.name);
    setInfo(country);
  };

  return (
    <>
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
        <ComposableMap>
          <Geographies geography={worldgeojson}>
            {({ geographies }) => {
              return geographies.map((geo) => {
                const country = countriesData.find(
                  (c) =>
                    c.name.toLowerCase() === geo.properties.name?.toLowerCase()
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (country) {
                        handleClick(country);
                      }
                    }}
                    style={{
                      default: { fill: "#D6D6DA", outline: "none" },
                      hover: { fill: "#F53", outline: "none" },
                      pressed: { fill: "#E42", outline: "none" },
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ComposableMap>

        {info && (
          <Card
            className="popup"
            style={{ display: "flex", justifyContent: "center" }}
            sx={{ borderRadius: 5, width: 300 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {info.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Capital:</strong> {info.capital}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Continent:</strong> {info.continent}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Area:</strong> {info.area} sq km
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setInfo(null)}
                sx={{ marginTop: 2 }}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default WorldMap;
