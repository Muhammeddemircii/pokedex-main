import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Card from "./components/Card";
import Header from "./components/Header";
import Details from "./pages/Details";

function Layout() {
  const location = useLocation();
  
  return (
    <>
      {!location.pathname.startsWith("/details/") && (
        <>
          <Header />
        </>
      )}
      
      <Routes>
        <Route path="/" element={<Card />} />
        <Route path="/details/:name" element={<Details />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
