import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes as RouterRoutes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Calculadora from "./pages/Calculadora";
import Hematologia from "./pages/Hematologia";
import "./App.css";

function getBackgroundClass(pathname) {
  switch (pathname) {
    case "/":
      return "home";
    case "/hematologia":
      return "hematologia";
    case "/calculadora":
      return "calculadora";
    default:
      return "";
  }
}

function LocationAwareApp() {
  const location = useLocation();

  useEffect(() => {
    const body = document.body;
    const backgroundClass = getBackgroundClass(location.pathname);
    if (backgroundClass) {
      body.classList.add(backgroundClass);
    }

    return () => {
      if (backgroundClass) {
        body.classList.remove(backgroundClass);
      }
    };
  }, [location.pathname]);

  return (
    <div className="content">
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/hematologia" element={<Hematologia />} />
      </RouterRoutes>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <LocationAwareApp />
      </div>
    </BrowserRouter>
  );
}

export default AppRoutes;
