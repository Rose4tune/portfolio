import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatDate, getRelativeTime } from "./date";

describe("date utils", () => {
  describe("formatDate", () => {
    it("should format Date object to Korean locale string", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date);

      // "2024년 1월 15일" 형식으로 반환되어야 함
      expect(result).toContain("2024");
      expect(result).toContain("1");
      expect(result).toContain("15");
    });

    it("should format string date to Korean locale string", () => {
      const dateString = "2024-01-15";
      const result = formatDate(dateString);

      expect(result).toContain("2024");
      expect(result).toContain("1");
      expect(result).toContain("15");
    });

    it("should use custom locale when provided", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date, "en-US");

      // 영어 형식으로 반환되어야 함 (예: "January 15, 2024")
      expect(result).toContain("January");
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("should handle different date formats", () => {
      const date1 = new Date("2024-12-31");
      const date2 = new Date(2024, 11, 31); // month는 0부터 시작

      const result1 = formatDate(date1);
      const result2 = formatDate(date2);

      expect(result1).toContain("2024");
      expect(result1).toContain("12");
      expect(result2).toContain("2024");
      expect(result2).toContain("12");
    });
  });

  describe("getRelativeTime", () => {
    beforeEach(() => {
      // 테스트를 위해 현재 시간을 고정
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-06-15T12:00:00"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "오늘" for today\'s date', () => {
      const today = new Date("2024-06-15T10:00:00");
      expect(getRelativeTime(today)).toBe("오늘");
    });

    it('should return "어제" for yesterday\'s date', () => {
      const yesterday = new Date("2024-06-14T12:00:00");
      expect(getRelativeTime(yesterday)).toBe("어제");
    });

    it('should return "N일 전" for dates within a week', () => {
      const threeDaysAgo = new Date("2024-06-12T12:00:00");
      expect(getRelativeTime(threeDaysAgo)).toBe("3일 전");

      const fiveDaysAgo = new Date("2024-06-10T12:00:00");
      expect(getRelativeTime(fiveDaysAgo)).toBe("5일 전");
    });

    it('should return "N주 전" for dates within a month', () => {
      const twoWeeksAgo = new Date("2024-06-01T12:00:00");
      expect(getRelativeTime(twoWeeksAgo)).toBe("2주 전");

      const threeWeeksAgo = new Date("2024-05-25T12:00:00");
      expect(getRelativeTime(threeWeeksAgo)).toBe("3주 전");
    });

    it('should return "N개월 전" for dates within a year', () => {
      const twoMonthsAgo = new Date("2024-04-15T12:00:00");
      expect(getRelativeTime(twoMonthsAgo)).toBe("2개월 전");

      const sixMonthsAgo = new Date("2023-12-15T12:00:00");
      expect(getRelativeTime(sixMonthsAgo)).toBe("6개월 전");
    });

    it('should return "N년 전" for dates over a year ago', () => {
      const oneYearAgo = new Date("2023-06-15T12:00:00");
      expect(getRelativeTime(oneYearAgo)).toBe("1년 전");

      const twoYearsAgo = new Date("2022-06-15T12:00:00");
      expect(getRelativeTime(twoYearsAgo)).toBe("2년 전");
    });

    it("should handle string date input", () => {
      const dateString = "2024-06-14T12:00:00";
      expect(getRelativeTime(dateString)).toBe("어제");
    });

    it("should handle edge case: exactly 7 days ago", () => {
      const sevenDaysAgo = new Date("2024-06-08T12:00:00");
      const result = getRelativeTime(sevenDaysAgo);
      // 7일 = 1주
      expect(result).toBe("1주 전");
    });

    it("should handle edge case: exactly 30 days ago", () => {
      const thirtyDaysAgo = new Date("2024-05-16T12:00:00");
      const result = getRelativeTime(thirtyDaysAgo);
      // 30일 = 1개월
      expect(result).toBe("1개월 전");
    });
  });
});
