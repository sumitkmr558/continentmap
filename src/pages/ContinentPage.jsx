import React from "react";
import { useParams, Link } from "react-router-dom";

export default function ContinentPage() {
  const { continentName } = useParams();
  return (
    <div>
      <h1>{continentName}</h1>
      <p>Details and data about {continentName}.</p>
      <Link to="/map">Back to Map</Link>
    </div>
  );
}
