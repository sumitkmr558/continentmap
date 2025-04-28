// MapComponent.js
import { Container } from "@mui/material";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// 7-continent GeoJSON (one feature per continent, with properties.continent)
const geoUrl =
  "https://gist.githubusercontent.com/hrbrmstr/91ea5cc9474286c72838/raw/continents.json";

const continentsData = [
  { name: "Africa", color: "red", tcolor: "Black" },
  { name: "Asia", color: "blue", tcolor: "White" },
  { name: "Europe", color: "green", tcolor: "Black" },
  { name: "North America", color: "yellow", tcolor: "Black" },
  { name: "South America", color: "purple", tcolor: "White" },
  { name: "Australia", color: "orange", tcolor: "Black" },
  { name: "Antarctica", color: "pink", tcolor: "Black" },
];

export default function MapComponent() {
  const [highlighted, setHighlighted] = useState(null);
  console.log(highlighted);
  return (
    <>
      <Container>
        {continentsData.map((c) => (
          <button
            key={c.name}
            onClick={() => setHighlighted(c.name)}
            style={{
              marginRight: 8,
              padding: "8px 12px",
              background: c.color,
              color: c.tcolor,
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {c.name}
          </button>
        ))}
        <button
          onClick={() => setHighlighted(null)}
          style={{
            marginLeft: 16,
            padding: "8px 12px",
            background: "#888",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Clear
        </button>

        <ComposableMap width={800} height={500}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // read the continent name from the GeoJSON feature
                const continentName = geo.properties.CONTINENT;
                console.log("continentName : ", geo.properties);
                const info = continentsData.find(
                  (c) => c.name === continentName
                );
                const isHighlighted = highlighted === continentName;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlighted && info ? info.color : "#D3D3D3"}
                    stroke="#555"
                    strokeWidth={0.5}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </Container>
    </>
  );
}
