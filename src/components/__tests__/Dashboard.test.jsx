import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import axios from "axios";
import Dashboard from "../Dashboard";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("../DNavbar", () => ({
  default: () => <div data-testid="dashboard-navbar" />,
}));

vi.mock("../Footer", () => ({
  default: () => <div data-testid="dashboard-footer" />,
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUserData = {
  name: "Izhan",
  gender: "male",
  weight: 70,
  weightScale: "kg",
  height: 175,
  lengthScale: "cm",
  date: "2000-01-01",
  activity: 1.2,
  mode: "Moderate Musclegain",
};

const mockFoods = [
  {
    name: "Chicken Karahi",
    calories: 4,
    proteins: 2,
    fats: 1,
    carbohydrates: 1,
    vA: 1,
    vB: 0.5,
    vC: 1,
    vE: 1,
    vK: 1,
    iron: 1,
    calcium: 1,
    magnesium: 1,
    showMore: true,
  },
];

let mockStoreData = [];

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
}

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreData = [];

    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    localStorage.setItem("token", "fake-token");

    axios.get.mockImplementation((url) => {
      if (url.includes("/getdata")) {
        return Promise.resolve({ status: 200, data: mockUserData });
      }
      if (url.includes("/store")) {
        return Promise.resolve({ status: 200, data: mockStoreData });
      }
      if (url.includes("/getfood2?page=0")) {
        return Promise.resolve({ status: 200, data: mockFoods });
      }
      if (url.includes("/search")) {
        return Promise.resolve({ status: 200, data: mockFoods });
      }
      return Promise.resolve({ status: 200, data: [] });
    });

    axios.post.mockResolvedValue({ status: 200, data: {} });
  });

  test("renders dashboard heading and macro cards", async () => {
    renderDashboard();

    expect(await screen.findByText(/nutrition tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/add food/i)).toBeInTheDocument();
    expect(screen.getByText(/meal log/i)).toBeInTheDocument();
    expect(screen.getByText(/^calories$/i)).toBeInTheDocument();
    expect(screen.getByText(/^protein$/i)).toBeInTheDocument();
  });

  test("opens the food dropdown when select food is clicked", async () => {
    const user = userEvent.setup();
    renderDashboard();

    const trigger = await screen.findByText(/select food/i);
    await user.click(trigger);

    expect(
      await screen.findByPlaceholderText(/search food/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/chicken karahi/i)).toBeInTheDocument();
    });
  });

  test("opens the meal log with persisted foods from the store", async () => {
    const user = userEvent.setup();
    mockStoreData = [
      {
        ...mockFoods[0],
        quantity: 2,
      },
    ];

    renderDashboard();

    await user.click(await screen.findByRole("button", { name: /meal log/i }));

    expect(await screen.findByText(/1 item tracked today/i)).toBeInTheDocument();
    expect(screen.getByText(/chicken karahi/i)).toBeInTheDocument();
    expect(screen.getByText(/qty: 2/i)).toBeInTheDocument();
  });

  test("navigates to edit profile when edit profile is clicked", async () => {
    const user = userEvent.setup();
    renderDashboard();

    await user.click(
      await screen.findByRole("button", { name: /edit profile/i }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/edit");
  });
});
