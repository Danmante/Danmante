import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about/",
  "/find-care/",
  "/for-patients/",
  "/for-nurses/",
  "/for-pharmacies/",
  "/patient/",
  "/nurse/",
  "/pharmacy/",
  "/admin/",
  "/safety/",
  "/signin/",
  "/privacy/",
  "/terms/",
  "/cookies/",
  "/accessibility/",
];

test.describe("public website route coverage", () => {
  for (const route of publicRoutes) {
    test(`${route} renders without a server error`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }
});

test("primary navigation reaches the patient experience", async ({ page }) => {
  await page.goto("/");
  const menuButton = page.locator(".menu-toggle");
  const navigationLink = page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Find Care" });
  if (!(await navigationLink.isVisible())) {
    await menuButton.click();
  }
  await navigationLink.click();
  await expect(page).toHaveURL(/\/patient\/$/);
  await expect(page.getByRole("heading", { name: /care that starts with understanding/i })).toBeVisible();
});

test("mobile navigation opens and closes accessibly", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.locator(".menu-toggle");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).not.toBeVisible();

  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: "Safety" }).click();
  await expect(page).toHaveURL(/\/safety\/$/);
});

test("FAQ disclosure exposes an honest platform status", async ({ page }) => {
  await page.goto("/");
  const question = page.locator("summary").filter({ hasText: "Is the platform live today?" });
  await expect(question).toBeVisible();
  await question.click();
  await expect(page.getByText(/buildable foundation and public website/i)).toBeVisible();
});

test("role pages show prepared rather than fabricated live workflows", async ({ page }) => {
  await page.goto("/nurse/");
  await expect(page.getByText("Professional workflow prepared")).toBeVisible();
  await expect(page.getByText(/not yet operational/i)).toBeVisible();
  await page.getByRole("link", { name: "Read the safety model" }).click();
  await expect(page).toHaveURL(/\/safety\/$/);
});

test("footer exposes legal and emergency pathways", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: "Privacy" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Email Danmante" })).toHaveAttribute("href", "mailto:danmante2@gmail.com");
  await expect(footer.getByText(/medical emergency/i)).toBeVisible();
});
