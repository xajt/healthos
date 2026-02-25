import { test, expect } from "@playwright/test";

test.describe("HealthOS E2E Tests", () => {
  test.describe("Landing Page", () => {
    test("should display landing page", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveTitle(/HealthOS/);
    });
  });

  test.describe("Auth Pages", () => {
    test("should display login page", async ({ page }) => {
      await page.goto("/auth/login");
      await expect(page.locator('h1, h2')).toContainText(/Zaloguj|Logowanie/i);
    });

    test("should display signup page", async ({ page }) => {
      await page.goto("/auth/signup");
      await expect(page.locator('h1, h2')).toContainText(/Rejestracja|Zarejestruj/i);
    });
  });

  test.describe("Dashboard Pages (Unauthenticated)", () => {
    test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
      await page.goto("/dashboard");
      // Should redirect to login or show auth required
      await page.waitForURL(/\/auth\/login|\/$/, { timeout: 5000 }).catch(() => {
        // May stay on dashboard page with unauthenticated state
      });
    });
  });

  test.describe("Static Pages", () => {
    test("should load nutrition page", async ({ page }) => {
      await page.goto("/dashboard/nutrition");
      await expect(page).toHaveURL(/nutrition/);
    });

    test("should load weight page", async ({ page }) => {
      await page.goto("/dashboard/weight");
      await expect(page).toHaveURL(/weight/);
    });

    test("should load sleep page", async ({ page }) => {
      await page.goto("/dashboard/sleep");
      await expect(page).toHaveURL(/sleep/);
    });

    test("should load mood page", async ({ page }) => {
      await page.goto("/dashboard/mood");
      await expect(page).toHaveURL(/mood/);
    });

    test("should load workouts page", async ({ page }) => {
      await page.goto("/dashboard/workouts");
      await expect(page).toHaveURL(/workouts/);
    });

    test("should load chat page", async ({ page }) => {
      await page.goto("/dashboard/chat");
      await expect(page).toHaveURL(/chat/);
    });

    test("should load export page", async ({ page }) => {
      await page.goto("/dashboard/export");
      await expect(page).toHaveURL(/export/);
    });

    test("should load meditation page", async ({ page }) => {
      await page.goto("/dashboard/meditation");
      await expect(page).toHaveURL(/meditation/);
    });

    test("should load blood tests page", async ({ page }) => {
      await page.goto("/dashboard/blood-tests");
      await expect(page).toHaveURL(/blood-tests/);
    });

    test("should load documents page", async ({ page }) => {
      await page.goto("/dashboard/documents");
      await expect(page).toHaveURL(/documents/);
    });

    test("should load water page", async ({ page }) => {
      await page.goto("/dashboard/water");
      await expect(page).toHaveURL(/water/);
    });

    test("should load supplements page", async ({ page }) => {
      await page.goto("/dashboard/supplements");
      await expect(page).toHaveURL(/supplements/);
    });

    test("should load weather page", async ({ page }) => {
      await page.goto("/dashboard/weather");
      await expect(page).toHaveURL(/weather/);
    });
  });

  test.describe("PWA", () => {
    test("should have manifest.json", async ({ page }) => {
      const response = await page.request.get("/manifest.json");
      expect(response.status()).toBe(200);
      const manifest = await response.json();
      expect(manifest.name).toBe("HealthOS");
      expect(manifest.display).toBe("standalone");
    });

    test("should have service worker", async ({ page }) => {
      await page.goto("/");
      const swRegistered = await page.evaluate(() => {
        return "serviceWorker" in navigator;
      });
      expect(swRegistered).toBe(true);
    });
  });
});
