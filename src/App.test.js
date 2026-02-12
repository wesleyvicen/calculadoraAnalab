import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./pages/Home";

test("renders home calculators links", () => {
  render(
    <MemoryRouter
      initialEntries={["/"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByText(/calculadora de íons/i)).toBeInTheDocument();
  expect(screen.getByText(/calculadora de hematologia/i)).toBeInTheDocument();
});
