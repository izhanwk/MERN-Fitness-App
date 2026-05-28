import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import axios from "axios";
import Changepassword from "../Changepassword";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("../Navbar", () => ({
  default: () => <div data-testid="changepassword-navbar" />,
}));

vi.mock("../Footer", () => ({
  default: () => <div data-testid="changepassword-footer" />,
}));

vi.mock("../Loader", () => ({
  default: () => <div data-testid="changepassword-loader" />,
}));

const mockShowAlert = vi.fn();

vi.mock("../Alert", () => ({
  useAlert: () => ({
    showAlert: mockShowAlert,
    Alert: () => <div data-testid="changepassword-alert" />,
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

function renderChangepassword() {
  return render(
    <MemoryRouter>
      <Changepassword />
    </MemoryRouter>,
  );
}

describe("Changepassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("shows an alert when OTP requests are rate limited", async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValue({
      status: 429,
      data: {
        message: "OTP request limit reached",
      },
    });

    renderChangepassword();

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "izhan@example.com",
    );
    await user.click(screen.getByRole("button", { name: /send otp/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/forgot-password$/),
        {
          email: "izhan@example.com",
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    expect(mockShowAlert).toHaveBeenCalledWith(
      "OTP request limit reached",
      "error",
      "OTP Failed",
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
