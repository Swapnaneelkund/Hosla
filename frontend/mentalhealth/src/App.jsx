import React,{useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MentalHealth from "./pages/MentalHealth";
import MentalHealthResult from "./pages/MentalHealthResult";

function App() {

  const [loading, setLoading] = useState(false);

  function showLoading() {
    setLoading(true);
  }

  function hideLoading() {
    setLoading(false);
  }

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          Loading...
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MentalHealth showLoading={showLoading} hideLoading={hideLoading}/>} />
          <Route path="/result" element={<MentalHealthResult />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;