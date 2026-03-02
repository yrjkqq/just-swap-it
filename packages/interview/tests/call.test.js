import { describe, it, expect } from "vitest";
import "../src/call.js"; // 加载 myCall 的 polyfill

describe("Function.prototype.myCall", () => {
  it("应该正确绑定 this", () => {
    function getName() {
      return this.name;
    }
    const person = { name: "Alice" };
    expect(getName.myCall(person)).toBe("Alice");
  });

  it("应该正确传递参数", () => {
    function greet(greeting, punctuation) {
      return `${greeting}, ${this.name}${punctuation}`;
    }
    const person = { name: "Bob" };
    expect(greet.myCall(person, "Hi", "!")).toBe("Hi, Bob!");
  });

  it("应该正确返回函数执行结果", () => {
    function add(a, b) {
      return a + b + this.base;
    }
    const obj = { base: 10 };
    expect(add.myCall(obj, 1, 2)).toBe(13);
  });

  it("context 为 null/undefined 时应兜底到 globalThis", () => {
    globalThis.__testValue = "global";
    function getTestValue() {
      return this.__testValue;
    }
    expect(getTestValue.myCall(null)).toBe("global");
    expect(getTestValue.myCall(undefined)).toBe("global");
    delete globalThis.__testValue;
  });

  it("不应该污染原始对象（调用后无残留属性）", () => {
    function noop() {}
    const obj = { a: 1 };
    const keysBefore = Object.keys(obj);
    noop.myCall(obj);
    const keysAfter = Object.keys(obj);
    expect(keysAfter).toEqual(keysBefore);
  });

  it("无参数时也能正常工作", () => {
    function whoAmI() {
      return this.name;
    }
    const obj = { name: "Charlie" };
    expect(whoAmI.myCall(obj)).toBe("Charlie");
  });
});
