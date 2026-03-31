import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { test, expect } from "@playwright/test";

import User from "../Model/User.js";
import Foods from "../Model/Foods.js";

const email = "playwright-e2e@example.com";
const password = "Password123";
const dbName = "fittrack_e2e";

if (dbName !== "fittrack_e2e") {
  throw new Error("Refusing to run E2E against a non-test database");
}

async function connectToE2EDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to run Playwright tests");
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, { dbName });
  }
}

test.beforeAll(async () => {
  await connectToE2EDatabase();
  await mongoose.connection.dropDatabase();

  await User.create({
    email,
    password: await bcrypt.hash(password, 10),
    verified: true,
    name: "Playwright User",
    date: new Date("2000-01-01"),
    gender: "male",
    weight: 70,
    weightScale: "kg",
    height: 175,
    lengthScale: "cm",
    goal: "Build Muscle",
    mode: "Moderate Musclegain",
    activity: 1.2,
    profileComplete: "Complete",
    array: [],
  });

  await Foods.create({
    name: "Chicken Karahi",
    portions: [
      {
        label: "1 serving",
        grams: 200,
        calories: 250,
        proteins: 25,
        fats: 10,
        carbohydrates: 8,
        vA: 1,
        vB: 0.5,
        vC: 1,
        vE: 1,
        vK: 1,
        iron: 1,
        calcium: 1,
        magnesium: 1,
      },
    ],
  });
});

test.afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

test("signs in, adds food, and views it on the dashboard", async ({ page }) => {
  await page.goto("/signin");

  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(/nutrition tracker/i)).toBeVisible();

  await page.getByText("Select Food", { exact: true }).click();
  await page.getByPlaceholder(/search food/i).fill("Chicken Karahi");
  await page.getByText("Chicken Karahi", { exact: true }).click();

  await page.getByText("Portion", { exact: true }).click();
  await page.getByText("1 serving", { exact: true }).click();
  await page.getByPlaceholder("Qty").fill("2");

  const saveStoreRequest = page.waitForResponse(
    (response) =>
      response.url().includes("/store") &&
      response.request().method() === "POST" &&
      response.status() === 200,
  );

  await page.getByRole("button", { name: /^add$/i }).click();
  await saveStoreRequest;

  await page.getByRole("button", { name: /meal log/i }).click();

  await expect(page.getByText(/1 item tracked today/i)).toBeVisible();
  await expect(page.getByText("Chicken Karahi", { exact: true })).toHaveCount(
    2,
  );
  await expect(page.getByText(/qty: 2/i)).toBeVisible();
});
