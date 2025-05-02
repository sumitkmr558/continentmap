// IndiaMap.jsx

// IndiaMap.jsx
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
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
  Paper,
} from "@mui/material";
const geoUrl = process.env.PUBLIC_URL + "/india_states.geojson";

// metadata keyed by ST_NM
const stateInfo = {
  "Andhra Pradesh": {
    capital: "Amaravati",
    type: "State",
    lokSabha: 25,
    vidhanSabha: 175,
    leader: "Y. S. Jagan Mohan Reddy",
  },
  "Arunachal Pradesh": {
    capital: "Itanagar",
    type: "State",
    lokSabha: 2,
    vidhanSabha: 60,
    leader: "Pema Khandu",
  },
  Assam: {
    capital: "Dispur",
    type: "State",
    lokSabha: 14,
    vidhanSabha: 126,
    leader: "Himanta Biswa Sarma",
  },
  Bihar: {
    capital: "Patna",
    type: "State",
    lokSabha: 40,
    vidhanSabha: 243,
    leader: "Nitish Kumar",
  },
  Chhattisgarh: {
    capital: "Raipur",
    type: "State",
    lokSabha: 11,
    vidhanSabha: 90,
    leader: "Bhupesh Baghel",
  },
  Goa: {
    capital: "Panaji",
    type: "State",
    lokSabha: 2,
    vidhanSabha: 40,
    leader: "Pramod Sawant",
  },
  Gujarat: {
    capital: "Gandhinagar",
    type: "State",
    lokSabha: 26,
    vidhanSabha: 182,
    leader: "Bhupendrabhai Patel",
  },
  Haryana: {
    capital: "Chandigarh",
    type: "State",
    lokSabha: 10,
    vidhanSabha: 90,
    leader: "Nayab Singh Saini",
  },
  "Himachal Pradesh": {
    capital: "Shimla",
    type: "State",
    lokSabha: 4,
    vidhanSabha: 68,
    leader: "Sukhvinder Singh Sukhu",
  },
  Jharkhand: {
    capital: "Ranchi",
    type: "State",
    lokSabha: 14,
    vidhanSabha: 81,
    leader: "Champai Soren",
  },
  Karnataka: {
    capital: "Bengaluru",
    type: "State",
    lokSabha: 28,
    vidhanSabha: 224,
    leader: "Siddaramaiah",
  },
  Kerala: {
    capital: "Thiruvananthapuram",
    type: "State",
    lokSabha: 20,
    vidhanSabha: 140,
    leader: "Pinarayi Vijayan",
  },
  "Madhya Pradesh": {
    capital: "Bhopal",
    type: "State",
    lokSabha: 29,
    vidhanSabha: 230,
    leader: "Mohan Yadav",
  },
  Maharashtra: {
    capital: "Mumbai",
    type: "State",
    lokSabha: 48,
    vidhanSabha: 288,
    leader: "Eknath Shinde",
  },
  Manipur: {
    capital: "Imphal",
    type: "State",
    lokSabha: 2,
    vidhanSabha: 60,
    leader: "N Biren Singh",
  },
  Meghalaya: {
    capital: "Shillong",
    type: "State",
    lokSabha: 2,
    vidhanSabha: 60,
    leader: "Conrad Sangma",
  },
  Mizoram: {
    capital: "Aizawl",
    type: "State",
    lokSabha: 1,
    vidhanSabha: 40,
    leader: "Lalduhoma",
  },
  Nagaland: {
    capital: "Kohima",
    type: "State",
    lokSabha: 1,
    vidhanSabha: 60,
    leader: "Neiphiu Rio",
  },
  Odisha: {
    capital: "Bhubaneswar",
    type: "State",
    lokSabha: 21,
    vidhanSabha: 147,
    leader: "Naveen Patnaik",
  },
  Punjab: {
    capital: "Chandigarh",
    type: "State",
    lokSabha: 13,
    vidhanSabha: 117,
    leader: "Bhagwant Mann",
  },
  Rajasthan: {
    capital: "Jaipur",
    type: "State",
    lokSabha: 25,
    vidhanSabha: 200,
    leader: "Bhajan Lal Sharma",
  },
  Sikkim: {
    capital: "Gangtok",
    type: "State",
    lokSabha: 1,
    vidhanSabha: 32,
    leader: "Prem Singh Tamang",
  },
  "Tamil Nadu": {
    capital: "Chennai",
    type: "State",
    lokSabha: 39,
    vidhanSabha: 234,
    leader: "M. K. Stalin",
  },
  Telangana: {
    capital: "Hyderabad",
    type: "State",
    lokSabha: 17,
    vidhanSabha: 119,
    leader: "Revanth Reddy",
  },
  Tripura: {
    capital: "Agartala",
    type: "State",
    lokSabha: 2,
    vidhanSabha: 60,
    leader: "Manik Saha",
  },
  "Uttar Pradesh": {
    capital: "Lucknow",
    type: "State",
    lokSabha: 80,
    vidhanSabha: 403,
    leader: "Yogi Adityanath",
  },
  Uttarakhand: {
    capital: "Dehradun",
    type: "State",
    lokSabha: 5,
    vidhanSabha: 70,
    leader: "Pushkar Singh Dhami",
  },
  "West Bengal": {
    capital: "Kolkata",
    type: "State",
    lokSabha: 42,
    vidhanSabha: 294,
    leader: "Mamata Banerjee",
  },
  // Union Territories:
  Delhi: {
    capital: "New Delhi",
    type: "NCR / UT",
    lokSabha: 7,
    vidhanSabha: 70,
    leader: "Arvind Kejriwal",
  },
  Puducherry: {
    capital: "Puducherry",
    type: "UT",
    lokSabha: 1,
    vidhanSabha: 30,
    leader: "N. Rangasamy",
  },
  Chandigarh: {
    capital: "Chandigarh",
    type: "UT",
    lokSabha: 1,
    vidhanSabha: 0,
    leader: "Vivek Joshi",
  },
  Andaman: {
    capital: "Port Blair",
    type: "UT",
    lokSabha: 1,
    vidhanSabha: 0,
    leader: "Adm. D. Chowdhury",
  },
  "Andaman & Nicobar Islands": {
    capital: "Port Blair",
    type: "UT",
    lokSabha: 1,
    vidhanSabha: 0,
    leader: "Adm. D. Choudhury",
  },
  Chandigarh: {
    capital: "Chandigarh",
    type: "UT",
    lokSabha: 1,
    vidhanSabha: 0,
    leader: "Vivek Joshi",
  },
  Delhi: {
    capital: "New Delhi",
    type: "NCR / UT",
    lokSabha: 7,
    vidhanSabha: 70,
    leader: "Arvind Kejriwal",
  },
  "Dadra & Nagar Haveli and Daman & Diu": {
    capital: "Daman",
    type: "UT",
    lokSabha: 2,
    vidhanSabha: 0,
    leader: "Praful Khoda Patel",
  },
  "Jammu & Kashmir": {
    capital: "Srinagar (Summer) / Jammu (Winter)",
    type: "UT",
    lokSabha: 5,
    vidhanSabha: 90, // legislative assembly seats
    leader: "Manoj Sinha",
  },
  Ladakh: {
    capital: "Leh",
    type: "UT",
    lokSabha: 1,
    vidhanSabha: 0,
    leader: "Radha Krishna Mathur",
  },
  Lakshadweep: {
    capital: "Kavaratti",
    type: "UT",
    lokSabha: 1,
    vidhanSabha: 0,
    leader: "Praful Khoda Patel",
  },
  Puducherry: {
    capital: "Puducherry",
    type: "UT",
    lokSabha: 1,
    vidhanSabha: 30,
    leader: "N. Rangasamy",
  },
};

export default function IndiaMap() {
  const [selected, setSelected] = useState({ props: null, x: 0, y: 0 });

  const handleClick = (geo, evt) => {
    const { clientX: x, clientY: y } = evt;
    setSelected({ props: geo.properties, x, y });
  };

  return (
    <>
      <Container sx={{ mt: 8 }}>
        <Card
          className="card_primary"
          sx={{ maxWidth: "800px", margin: "auto" }}
        >
          <CardHeader title={"India State Map"} />
          <CardContent>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [80, 22], scale: 1000 }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.ST_NM;
                    const isSelected = selected.props?.ST_NM === name;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={(e) => handleClick(geo, e)}
                        fill={isSelected ? "#FF5722" : "#C0C0C0"}
                        stroke="#333"
                        strokeWidth={isSelected ? 1.5 : 0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#FFD700", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            {selected.props && (
              <Box
                sx={{
                  position: "absolute",
                  top: selected.y + 10,
                  left: selected.x + 10,
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    backgroundColor: "white",
                    fontSize: 14,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontSize: 16 }}>
                    {selected.props.ST_NM}
                  </Typography>
                  {stateInfo[selected.props.ST_NM] ? (
                    <>
                      <Typography>
                        <strong>Capital:</strong>{" "}
                        {stateInfo[selected.props.ST_NM].capital}
                      </Typography>
                      <Typography>
                        <strong>Type:</strong>{" "}
                        {stateInfo[selected.props.ST_NM].type}
                      </Typography>
                      <Typography>
                        <strong>Lok Sabha seats:</strong>{" "}
                        {stateInfo[selected.props.ST_NM].lokSabha}
                      </Typography>
                      <Typography>
                        <strong>Vidhan Sabha seats:</strong>{" "}
                        {stateInfo[selected.props.ST_NM].vidhanSabha}
                      </Typography>
                      <Typography>
                        <strong>Leader:</strong>{" "}
                        {stateInfo[selected.props.ST_NM].leader}
                      </Typography>
                    </>
                  ) : (
                    <Typography component="em">No data available</Typography>
                  )}
                </Paper>
              </Box>
            )}

            {/* {selected.props && (
              <div
                style={{
                  position: "absolute",
                  top: selected.y + 10,
                  left: selected.x + 10,
                  padding: "12px 16px",
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  pointerEvents: "none",
                  fontSize: 14,
                  zIndex: 10,
                }}
              >
                <h4 style={{ margin: "0 0 8px" }}>{selected.props.ST_NM}</h4>
                {stateInfo[selected.props.ST_NM] ? (
                  <div>
                    <div>
                      <strong>Capital:</strong>{" "}
                      {stateInfo[selected.props.ST_NM].capital}
                    </div>
                    <div>
                      <strong>Type:</strong>{" "}
                      {stateInfo[selected.props.ST_NM].type}
                    </div>
                    <div>
                      <strong>Lok Sabha seats:</strong>{" "}
                      {stateInfo[selected.props.ST_NM].lokSabha}
                    </div>
                    <div>
                      <strong>Vidhan Sabha seats:</strong>{" "}
                      {stateInfo[selected.props.ST_NM].vidhanSabha}
                    </div>
                    <div>
                      <strong>Leader:</strong>{" "}
                      {stateInfo[selected.props.ST_NM].leader}
                    </div>
                  </div>
                ) : (
                  <em>No data available</em>
                )}
              </div>
            )} */}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
