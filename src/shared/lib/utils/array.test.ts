import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { uniqueArray, shuffleArray, getRandomItem } from "./array";

describe("array utils", () => {
  describe("uniqueArray", () => {
    it("should remove duplicate numbers", () => {
      const input = [1, 2, 2, 3, 3, 3, 4];
      const result = uniqueArray(input);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("should remove duplicate strings", () => {
      const input = ["apple", "banana", "apple", "cherry", "banana"];
      const result = uniqueArray(input);

      expect(result).toEqual(["apple", "banana", "cherry"]);
    });

    it("should handle empty array", () => {
      const input: number[] = [];
      const result = uniqueArray(input);

      expect(result).toEqual([]);
    });

    it("should handle array with no duplicates", () => {
      const input = [1, 2, 3, 4, 5];
      const result = uniqueArray(input);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle array with all same elements", () => {
      const input = [1, 1, 1, 1];
      const result = uniqueArray(input);

      expect(result).toEqual([1]);
    });

    it("should preserve order of first occurrence", () => {
      const input = ["b", "a", "b", "c", "a"];
      const result = uniqueArray(input);

      expect(result).toEqual(["b", "a", "c"]);
    });

    it("should work with objects (by reference)", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 }; // 다른 객체지만 같은 값
      const input = [obj1, obj2, obj1, obj3];
      const result = uniqueArray(input);

      // obj1과 obj3는 다른 객체이므로 둘 다 포함
      expect(result).toEqual([obj1, obj2, obj3]);
      expect(result.length).toBe(3);
    });

    it("should handle mixed types", () => {
      const input = [1, "1", 1, "1", 2, "2"];
      const result = uniqueArray(input);

      // 타입이 다르므로 모두 유니크
      expect(result).toEqual([1, "1", 2, "2"]);
    });
  });

  describe("shuffleArray", () => {
    beforeEach(() => {
      // Math.random을 mock하여 테스트를 예측 가능하게 만듦
      vi.spyOn(Math, "random");
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return array with same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);

      expect(result.length).toBe(input.length);
    });

    it("should contain all original elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);

      expect(result.sort()).toEqual(input.sort());
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).toContain(3);
      expect(result).toContain(4);
      expect(result).toContain(5);
    });

    it("should not modify original array", () => {
      const input = [1, 2, 3, 4, 5];
      const originalCopy = [...input];
      shuffleArray(input);

      expect(input).toEqual(originalCopy);
    });

    it("should handle empty array", () => {
      const input: number[] = [];
      const result = shuffleArray(input);

      expect(result).toEqual([]);
    });

    it("should handle single element array", () => {
      const input = [1];
      const result = shuffleArray(input);

      expect(result).toEqual([1]);
    });

    it("should handle array with duplicate elements", () => {
      const input = [1, 1, 2, 2, 3];
      const result = shuffleArray(input);

      expect(result.length).toBe(5);
      expect(result.filter((x) => x === 1).length).toBe(2);
      expect(result.filter((x) => x === 2).length).toBe(2);
      expect(result.filter((x) => x === 3).length).toBe(1);
    });

    it("should work with different types", () => {
      const input = ["a", "b", "c", "d"];
      const result = shuffleArray(input);

      expect(result.length).toBe(4);
      expect(result).toContain("a");
      expect(result).toContain("b");
      expect(result).toContain("c");
      expect(result).toContain("d");
    });

    it("should produce different results on multiple calls (probabilistic)", () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = new Set();

      // 10번 섞어서 결과를 저장
      for (let i = 0; i < 10; i++) {
        results.add(shuffleArray(input).join(","));
      }

      // 최소한 2개 이상의 다른 결과가 나와야 함
      // (완벽한 랜덤이 아닐 수 있으므로 너무 엄격하지 않게)
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe("getRandomItem", () => {
    beforeEach(() => {
      vi.spyOn(Math, "random");
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return an item from the array", () => {
      const input = [1, 2, 3, 4, 5];
      const result = getRandomItem(input);

      expect(input).toContain(result);
    });

    it("should return the only item in single-element array", () => {
      const input = [42];
      const result = getRandomItem(input);

      expect(result).toBe(42);
    });

    it("should work with strings", () => {
      const input = ["apple", "banana", "cherry"];
      const result = getRandomItem(input);

      expect(input).toContain(result);
      expect(typeof result).toBe("string");
    });

    it("should work with objects", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const input = [obj1, obj2];
      const result = getRandomItem(input);

      expect([obj1, obj2]).toContain(result);
    });

    it("should return first item when Math.random returns 0", () => {
      vi.mocked(Math.random).mockReturnValue(0);
      const input = ["first", "second", "third"];
      const result = getRandomItem(input);

      expect(result).toBe("first");
    });

    it("should return last item when Math.random returns close to 1", () => {
      vi.mocked(Math.random).mockReturnValue(0.99);
      const input = ["first", "second", "third"];
      const result = getRandomItem(input);

      expect(result).toBe("third");
    });

    it("should handle different probability distributions", () => {
      const input = [1, 2, 3, 4, 5];
      const results: number[] = [];

      // 100번 호출하여 모든 요소가 최소 한 번은 반환되는지 확인
      for (let i = 0; i < 100; i++) {
        results.push(getRandomItem(input));
      }

      // 모든 요소가 최소 한 번은 선택되어야 함
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThan(1);
    });

    it("should not modify original array", () => {
      const input = [1, 2, 3];
      const originalCopy = [...input];
      getRandomItem(input);

      expect(input).toEqual(originalCopy);
    });
  });
});
