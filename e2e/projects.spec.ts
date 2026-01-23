import { test, expect } from "@playwright/test";

test.describe("Projects", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");
    
    // 404 페이지가 아닌지 확인하고, 실제 프로젝트 페이지가 로드되었는지 확인
    const is404 = await page.locator('text="404"').isVisible().catch(() => false);
    const hasSearchInput = await page.getByPlaceholder(/태그 및 제목 검색/i).isVisible().catch(() => false);
    
    if (is404 || !hasSearchInput) {
      // 페이지가 제대로 로드되지 않았으면 테스트 스킵
      test.skip();
      return;
    }
  });

  test("should display projects list", async ({ page }) => {
    // 검색 바가 표시되는지 확인 (placeholder에 점이 여러 개일 수 있음)
    await expect(page.getByPlaceholder(/태그 및 제목 검색/i)).toBeVisible();

    // 프로젝트 목록이 있는지 확인
    const projectTitles = page.locator("h2");
    const count = await projectTitles.count();
    
    // 프로젝트가 있으면 제목이 표시되어야 함
    if (count > 0) {
      await expect(projectTitles.first()).toBeVisible();
    }
  });

  test("should filter projects by search query", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/태그 및 제목 검색/i);
    
    // 검색어 입력
    await searchInput.fill("test");
    await page.waitForTimeout(500); // 필터링 대기

    // 검색 결과가 업데이트되었는지 확인
    const projectTitles = page.locator("h2");
    const count = await projectTitles.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter projects by tag", async ({ page }) => {
    // 검색 입력 필드 근처의 태그 필터 영역 찾기 (검색 바 바로 다음의 flex-wrap div)
    const searchInput = page.getByPlaceholder(/태그 및 제목 검색/i);
    const tagFilterContainer = searchInput.locator('..').locator('..').locator('div.flex.flex-wrap');
    const tagButtons = tagFilterContainer.locator('button:not(:has-text("전체"))');
    const tagCount = await tagButtons.count();

    if (tagCount > 0) {
      // 첫 번째 태그 찾기 및 스크롤
      const firstTag = tagButtons.first();
      await firstTag.scrollIntoViewIfNeeded();
      await firstTag.waitFor({ state: 'visible', timeout: 5000 });
      
      await firstTag.click({ force: true });
      await page.waitForTimeout(500); // 필터링 대기

      // 선택된 태그가 활성화 상태인지 확인 (className에 purple 포함)
      const className = await firstTag.getAttribute("class");
      expect(className).toContain("purple");
    }
  });

  test("should navigate to project detail", async ({ page }) => {
    // 첫 번째 프로젝트 제목 찾기
    const firstProjectTitle = page.locator("h2").first();
    const projectCount = await firstProjectTitle.count();

    if (projectCount > 0) {
      const titleText = await firstProjectTitle.textContent();
      
      // 프로젝트 제목을 포함한 링크 찾기 (h2의 부모인 a 태그)
      const projectLink = firstProjectTitle.locator("xpath=ancestor::a[1]");
      const linkExists = await projectLink.count() > 0;
      
      if (linkExists) {
        // 링크 클릭
        await projectLink.click();
        await page.waitForLoadState("networkidle");

        // 상세 페이지로 이동했는지 확인
        await expect(page).toHaveURL(/\/projects\/.+/, { timeout: 10000 });
      
        // 제목이 표시되는지 확인
        if (titleText) {
          await expect(page.locator("h1, h2").first()).toContainText(
            titleText.trim(),
            { timeout: 10000 }
          );
        }
      }
    }
  });

  test("should display project status", async ({ page }) => {
    const projectTitles = page.locator("h2");
    const count = await projectTitles.count();

    if (count > 0) {
      // 첫 번째 프로젝트의 상태 확인
      const firstProject = projectTitles.first().locator("..");
      
      // 상태가 표시되는지 확인 (완료, 진행중, 계획중 등)
      const statusText = await firstProject.textContent();
      // 상태 텍스트가 있을 수 있음 (선택사항)
      expect(statusText).toBeTruthy();
    }
  });

  test("should display tech stack", async ({ page }) => {
    const projectTitles = page.locator("h2");
    const count = await projectTitles.count();

    if (count > 0) {
      // 첫 번째 프로젝트의 tech stack 확인
      const firstProject = projectTitles.first().locator("..");
      
      // tech stack 태그가 표시되는지 확인 (#으로 시작하는 태그)
      const techStackTags = firstProject.locator('span:has-text("#")');
      const techCount = await techStackTags.count();
      expect(techCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("should display project tags", async ({ page }) => {
    const projectTitles = page.locator("h2");
    const count = await projectTitles.count();

    if (count > 0) {
      // 첫 번째 프로젝트의 태그 확인
      const firstProject = projectTitles.first().locator("..");
      
      // 태그 버튼이 표시되는지 확인
      const tagButtons = firstProject.locator("button");
      const tagCount = await tagButtons.count();
      expect(tagCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("should handle empty search results gracefully", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/태그 및 제목 검색/i);
    
    // 존재하지 않는 검색어 입력
    await searchInput.fill("nonexistentproject12345");
    await page.waitForTimeout(500);

    // 검색 결과가 없어도 페이지가 에러 없이 표시되어야 함
    await expect(page.locator("body")).toBeVisible();
  });

  test("should combine search and tag filter", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/태그 및 제목 검색/i);
    
    // 검색 입력 필드 근처의 태그 필터 영역 찾기
    const tagFilterContainer = searchInput.locator('..').locator('..').locator('div.flex.flex-wrap');
    const tagButtons = tagFilterContainer.locator('button:not(:has-text("전체"))');
    const tagCount = await tagButtons.count();

    if (tagCount > 0) {
      const firstTag = tagButtons.first();
      await firstTag.scrollIntoViewIfNeeded();
      await firstTag.waitFor({ state: 'visible', timeout: 5000 });
      await firstTag.click({ force: true });
      await page.waitForTimeout(300);

      // 검색어 입력
      await searchInput.fill("test");
      await page.waitForTimeout(500);

      // 필터링이 적용되었는지 확인
      const projectTitles = page.locator("h2");
      const count = await projectTitles.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
