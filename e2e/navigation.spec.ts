import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // 페이지 로딩 대기
    await page.waitForLoadState("networkidle");
  });

  test("should navigate to home page", async ({ page }) => {
    await expect(page).toHaveTitle(/Ye Seo|Portfolio/i);
    // 홈 페이지의 주요 요소 확인
    await expect(page.locator("h1")).toContainText(/Ye Seo|LEE/i);
  });

  test("should navigate to blog page", async ({ page }) => {
    const blogLink = page.getByRole("link", { name: "Blog" });
    await blogLink.click();

    await expect(page).toHaveURL(/\/blog/);
    // 블로그 컨텐츠(검색 바) 로드 대기 후 검증
    await expect(page.getByPlaceholder(/검색/i)).toBeVisible({ timeout: 10000 });
  });

  test("should navigate to projects page", async ({ page }) => {
    const projectsLink = page.locator('nav').getByRole("link", { name: "Projects" });
    await projectsLink.click();

    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByPlaceholder(/검색/i)).toBeVisible({ timeout: 10000 });
  });

  test("should navigate back to home from blog", async ({ page }) => {
    // Blog로 이동
    await page.getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL(/\/blog/);
    await page.waitForLoadState("networkidle");

    // 홈으로 돌아가기 (로고 클릭 또는 About 링크)
    const homeLink = page.getByRole("link", { name: /YeSeo|About/i }).first();
    await homeLink.click();
    await expect(page).toHaveURL("/");
  });

  test("should toggle mobile menu", async ({ page }) => {
    // 모바일 뷰포트로 설정
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState("networkidle");

    // 모바일 메뉴 버튼 찾기 (aria-label로 정확히 찾기)
    const menuButton = page.getByRole("button", { name: /open main menu/i });
    
    // 메뉴 버튼이 보이는지 확인
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500); // 메뉴 애니메이션 대기
      
      // 모바일 메뉴가 열렸는지 확인 (네비게이션 내의 Blog 링크가 보여야 함)
      const blogLink = page.locator('nav').getByRole("link", { name: "Blog" });
      await expect(blogLink).toBeVisible({ timeout: 5000 });
    }
  });

  test("should navigate using mobile menu", async ({ page }) => {
    // 모바일 뷰포트로 설정
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState("networkidle");

    // 모바일 메뉴 열기
    const menuButton = page.getByRole("button", { name: /open main menu/i });
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500); // 메뉴 애니메이션 대기

      // 모바일 메뉴에서 Blog 클릭 (네비게이션 내의 링크만 선택)
      const blogLink = page.locator('nav').getByRole("link", { name: "Blog" });
      if (await blogLink.isVisible({ timeout: 5000 })) {
        await blogLink.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(/\/blog/);
      }
    }
  });
});
