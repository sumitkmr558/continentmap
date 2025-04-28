import logo from "./logo.svg";
import "./App.css";
import WorldMap from "./WorldMap";
import GlobeComponent from "./GlobeComponent";

function App() {
  return (
    <div className="App">
      <h1>World Map</h1>
      <WorldMap />
      {/* <GlobeComponent /> */}
    </div>
  );
}

export default App;
