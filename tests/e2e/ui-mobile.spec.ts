import { expect, test } from "@playwright/test";

// 모바일 뷰에서 주요 UI 요소가 정상적으로 보이지 않는지(즉, 개선 전 문제점이 노출되는지) 확인하는 TDD용 실패 테스트

test.describe("모바일 UI/UX 개선 전 문제점 확인", () => {
  test.use({ viewport: { width: 375, height: 700 } }); // iPhone SE/12 Mini 크기

  test("하단 테이블이 스크롤 가능하다", async ({ page }) => {
    await page.goto("/");
    const table = page.locator('[data-testid="utility-display"]');
    await expect(table).toBeVisible();
    // 스크롤 가능 여부 확인 (overflow-y: auto 또는 scroll)
    const overflowY = await table.evaluate(
      (el) => getComputedStyle(el).overflowY,
    );
    expect(["auto", "scroll"]).toContain(overflowY);
  });

  test("조정 패널/헤더에 패딩이 있다", async ({ page }) => {
    await page.goto("/");
    const panel = page.locator('[data-testid="control-panel"]');
    const style = await panel.evaluate((el) => getComputedStyle(el).padding);
    // 개선 후: 패딩이 0이 아니어야 함 (예: '16px 24px' 등)
    expect(style).not.toBe("0px");
    // 최소한 좌우 패딩이 16px 이상인지 확인
    const paddings = style.split(" ");
    if (paddings.length === 4) {
      const px = parseInt(paddings[1], 10);
      expect(px).toBeGreaterThanOrEqual(16);
    }
  });

  test("에이전트 캔버스가 보이고 테두리/패딩이 있다", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator('[data-testid="grid-canvas"]');
    await expect(canvas).toBeVisible();
    const border = await canvas.evaluate(
      (el) => getComputedStyle(el).borderWidth,
    );
    expect(border).not.toBe("0px");
    const padding = await canvas.evaluate((el) => getComputedStyle(el).padding);
    expect(padding).not.toBe("0px");
  });

  test("슬라이더 핸들이 보이고 불투명하다", async ({ page }) => {
    await page.goto("/");
    const sliderHandle = page.locator('[data-testid="slider-handle"]').first();
    await expect(sliderHandle).toBeVisible();
    const opacity = await sliderHandle.evaluate(
      (el) => getComputedStyle(el).opacity,
    );
    expect(opacity).toBe("1");
  });
});
