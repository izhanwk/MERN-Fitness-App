import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import axios from "axios";
import Signin from "../Signin";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("../Navbar", () => ({
  default: () => <div data-testid="signin-navbar" />,
}));

vi.mock("../Footer", () => ({
  default: () => <div data-testid="signin-footer" />,
}));

vi.mock("../Loader", () => ({
  default: () => <div data-testid="signin-loader" />,
}));

const mockShowAlert = vi.fn();

vi.mock("../Alert", () => ({
  useAlert: () => ({
    showAlert: mockShowAlert,
    Alert: () => <div data-testid="signin-alert" />,
  }),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderSignin() {
  return render(
    <MemoryRouter>
      <Signin />
    </MemoryRouter>,
  );
}

describe("Signin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("renders sign in form content", () => {
    renderSignin();

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  });

  test("submits valid credentials and navigates to dashboard", async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        data: {
          token: "fake-token",
          sessionId: "session-123",
        },
      },
    });

    renderSignin();

    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "izhan@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/enter your password/i),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/signin$/),
        {
          email: "izhan@example.com",
          password: "password123",
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    expect(localStorage.getItem("token")).toBe("fake-token");
    expect(localStorage.getItem("sessionId")).toBe("session-123");
    expect(mockShowAlert).not.toHaveBeenCalled();
  });

  test("redirects incomplete profiles to setup with the submitted email", async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValue({
      status: 302,
      data: {
        data: {
          token: "pending-token",
        },
      },
    });

    renderSignin();

    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "setup@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/enter your password/i),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/signup/userdata", {
        state: { email: "setup@example.com" },
      });
    });

    expect(localStorage.getItem("token")).toBe("pending-token");
    expect(mockShowAlert).toHaveBeenCalledWith(
      "Incomplete profile, redirecting...",
      "info",
      "Profile Setup Required",
    );
  });

  test("shows server validation errors for invalid credentials", async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValue({
      status: 401,
      data: {
        message: "Invalid email or password",
      },
    });

    renderSignin();

    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "wrong@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/enter your password/i),
      "wrongpass",
    );
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    const errors = await screen.findAllByText(/invalid email or password/i);
    expect(errors).toHaveLength(2);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockShowAlert).not.toHaveBeenCalled();
  });

  test("shows a connection alert when the sign-in request fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    axios.post.mockRejectedValue(new Error("Network error"));

    renderSignin();

    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "izhan@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/enter your password/i),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "An error occurred. Please try again.",
        "error",
        "Connection Error",
      );
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
