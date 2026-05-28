import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import axios from "axios";
import Register from "../Register";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("../Navbar", () => ({
  default: () => <div data-testid="register-navbar" />,
}));

vi.mock("../Footer", () => ({
  default: () => <div data-testid="register-footer" />,
}));

vi.mock("../Loader", () => ({
  default: () => <div data-testid="register-loader" />,
}));

const mockShowAlert = vi.fn();

vi.mock("../Alert", () => ({
  useAlert: () => ({
    showAlert: mockShowAlert,
    Alert: () => <div data-testid="register-alert" />,
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

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
}

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders registration form content", () => {
    renderRegister();

    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByText(/register new account/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/create a password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/re-enter your password/i),
    ).toBeInTheDocument();
  });

  test("submits valid registration data, shows success alert, and redirects", async () => {
    let redirectCallback;
    vi.spyOn(globalThis, "setTimeout").mockImplementation((callback) => {
      redirectCallback = callback;
      return 1;
    });
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        email: "izhan@example.com",
      },
    });

    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "izhan@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/create a password/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/re-enter your password/i), {
      target: { value: "Password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/register$/),
      {
        email: "izhan@example.com",
        password: "Password123",
        repassword: "Password123",
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );

    expect(mockShowAlert).toHaveBeenCalledWith(
      "Registration Successful! Please check izhan@example.com for verification.",
      "success",
      "Account Created",
      8000,
    );

    redirectCallback();

    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  test("shows a validation error when passwords do not match", async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "izhan@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/create a password/i),
      "Password123",
    );
    await user.type(
      screen.getByPlaceholderText(/re-enter your password/i),
      "different123",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText(/the passwords do not match/i),
    ).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("shows an email error when the account already exists", async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValue({
      status: 409,
      data: {},
    });

    renderRegister();

    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "izhan@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/create a password/i),
      "Password123",
    );
    await user.type(
      screen.getByPlaceholderText(/re-enter your password/i),
      "Password123",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText(/this email already exists/i),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockShowAlert).not.toHaveBeenCalled();
  });

  test("shows an alert when registration fails unexpectedly", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    axios.post.mockRejectedValue(new Error("Registration failed"));

    renderRegister();

    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "izhan@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/create a password/i),
      "Password123",
    );
    await user.type(
      screen.getByPlaceholderText(/re-enter your password/i),
      "Password123",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockShowAlert).toHaveBeenCalledWith(
      "Oops! There occurred a problem",
      "error",
      "Registration Failed",
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
