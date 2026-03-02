Function.prototype.myCall = function (context, ...args) {
  // 1. 防御性处理：如果没有传 context，或者传了 null/undefined，默认指向全局
  // (用 globalThis 最严谨，因为兼容浏览器 window 和 Node.js 的 global)
  context = context || globalThis;

  // 2. 核心：用 Symbol 作为一个独一无二的 key，防止覆盖对象上原有的同名属性
  const fnKey = Symbol("fn");

  // 3. 借鸡生蛋：这里的 this 就是调用 myCall 的那个普通函数
  // 我们把它挂载到目标对象 context 上
  context[fnKey] = this;

  // 4. 执行函数：因为是 context 调用的，所以函数内部的 this 自然就指向了 context
  const result = context[fnKey](...args);

  // 5. 过河拆桥：用完赶紧删掉，别弄脏了人家的对象
  delete context[fnKey];

  // 6. 返回执行结果
  return result;
};

// 测试一下：
function greet(greeting) {
  console.log(`${greeting}, I am ${this.name}`);
}
const person = { name: "Alice" };

greet.myCall(person, "Hello"); // 输出: "Hello, I am Alice"

// greet("Hello");

// greet.call(person, "Hello");

// greet.apply(person, ["Hello"]);

const greet2 = greet.bind(person);
greet2("Hello");
