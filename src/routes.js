import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as RouterRoutes,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Calculadora from "./pages/Calculadora";
import Hematologia from "./pages/Hematologia";
import Cronometros from "./pages/Cronometros";
import GlicemiaEstimada from "./pages/GlicemiaEstimada";
import DepuracaoCreatinina from "./pages/DepuracaoCreatinina";
import FiltracaoGlomerular from "./pages/FiltracaoGlomerular";
import RelacaoAlbuminaCreatinina from "./pages/RelacaoAlbuminaCreatinina";
import SaturacaoTransferrina from "./pages/SaturacaoTransferrina";
import AdminUsuarios from "./pages/AdminUsuarios";
import Institucional from "./pages/Institucional";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import { AdminRoute, GuestRoute, ProtectedRoute } from "./components/AuthRoutes";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function getBackgroundClass(pathname) {
  switch (pathname) {
    case "/":
      return "home";
    case "/hematologia":
      return "hematologia";
    case "/calculadora":
      return "calculadora";
    case "/cronometros":
      return "cronometros";
    case "/glicemia-estimada":
      return "glicemia-estimada";
    case "/depuracao-creatinina":
      return "depuracao-creatinina";
    case "/filtracao-glomerular":
      return "filtracao-glomerular";
    case "/relacao-albumina-creatinina":
      return "relacao-albumina-creatinina";
    case "/saturacao-transferrina":
      return "saturacao-transferrina";
    case "/admin/usuarios":
      return "admin-usuarios";
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
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<RootRoute />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/calculadora" element={<Calculadora />} />
          <Route path="/hematologia" element={<Hematologia />} />
          <Route path="/cronometros" element={<Cronometros />} />
          <Route path="/glicemia-estimada" element={<GlicemiaEstimada />} />
          <Route path="/depuracao-creatinina" element={<DepuracaoCreatinina />} />
          <Route path="/filtracao-glomerular" element={<FiltracaoGlomerular />} />
          <Route
            path="/relacao-albumina-creatinina"
            element={<RelacaoAlbuminaCreatinina />}
          />
          <Route path="/saturacao-transferrina" element={<SaturacaoTransferrina />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    </div>
  );
}

function RootRoute() {
  const { loading, session } = useAuth();

  if (loading) {
    return null;
  }

  if (session) {
    return <Home />;
  }

  return <Institucional />;
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
