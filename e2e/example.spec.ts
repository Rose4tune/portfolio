import { test, expect } from "@playwright/test";

/**
 * 기본 E2E 테스트 예제
 * 실제 테스트는 나중에 추가할 예정
 */
test.describe("Example E2E Test", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/YeSeo|Portfolio/i);
  });
});
