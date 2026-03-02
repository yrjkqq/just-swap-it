Function.prototype.myBind = function (context, ...args1) {
  // 1. 防御性处理：调用 bind 的必须是个函数
  if (typeof this !== "function") {
    throw new TypeError("Error: bind must be called on a function");
  }

  // 保存原函数的引用
  const originalFn = this;

  // 2. 返回一个全新的函数
  return function boundFn(...args2) {
    // 3. 合并两次传入的参数 (柯里化特性)
    const finalArgs = [...args1, ...args2];

    // 4. 核心填坑：判断当前是不是在用 new 调用 boundFn？
    // 如果是通过 new 调用的，this 应该指向 boundFn 的实例
    if (this instanceof boundFn) {
      // 此时相当于正常 new 原函数
      return new originalFn(...finalArgs);
    }

    // 5. 如果是普通调用，直接用 apply 把 this 绑定到当初指定的 context 上
    return originalFn.apply(context, finalArgs);
  };
};

// 测试一下：
function greet(greeting) {
  console.log(`${greeting}, I am ${this.name}`);
}
const person = { name: "Alice" };

const greet1 = greet.bind(person);
greet1("Hello");

const greet2 = greet.myBind(person);
greet2("Hello");
