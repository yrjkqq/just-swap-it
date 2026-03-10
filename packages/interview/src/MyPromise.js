// 1. 定义三种核心状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    // 初始状态为 pending
    this.state = PENDING;
    // 保存成功的值
    this.value = undefined;
    // 保存失败的原因
    this.reason = undefined;

    // 存放成功和失败回调的队列（发布-订阅模式的核心）
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // 2. 定义 resolve 函数
    const resolve = (value) => {
      // 只有在 pending 状态才能更改状态
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        // 依次执行成功回调
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    // 3. 定义 reject 函数
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        // 依次执行失败回调
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    // 4. 立即执行 executor，并捕获执行过程中的报错
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // 5. 实现 then 方法
  then(onFulfilled, onRejected) {
    // 如果状态已经确定为 fulfilled，直接执行成功回调
    if (this.state === FULFILLED) {
      onFulfilled(this.value);
    }
    // 如果状态已经确定为 rejected，直接执行失败回调
    else if (this.state === REJECTED) {
      onRejected(this.reason);
    }
    // 如果还是 pending 状态（说明是异步操作），将回调存入队列
    else if (this.state === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}

const promise = new MyPromise((resolve, reject) => {
  console.log("1. Executor 立即执行");
  setTimeout(() => {
    resolve("2. 异步数据获取成功");
  }, 1000);
});

promise.then(
  (res) => console.log("3. then 收到结果:", res),
  (err) => console.log("then 收到错误:", err),
);
