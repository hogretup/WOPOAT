import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SignupPage from "./SignupPage";
import fetchMock from "jest-fetch-mock";
import { MemoryRouter } from "react-router-dom";

// Mock the fetch function before running the tests
fetchMock.enableMocks();

test("renders the sign-up form and handles form submission", async () => {
  // Render the component
  render(<MemoryRouter><SignupPage /></MemoryRouter>);

  // Find form elements
  const usernameInput = screen.getByLabelText("Username *");
  const passwordInput = screen.getByLabelText("Password *"); // Also add an asterisk for the "Password" label

  // Fill in form inputs
  fireEvent.change(usernameInput, { target: { value: "testUser" } });
  fireEvent.change(passwordInput, { target: { value: "testPassword" } });

  // Mock the API response for unsuccessful signup
  fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

  // Reset fetch mocks
  fetchMock.resetMocks();
});
