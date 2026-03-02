class Scheduler {
  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency; // 窗口总数（最大并发数）
    this.activeCount = 0; // 正在办理业务的人数（当前运行任务数）
    this.queue = []; // 大厅里排队的队伍（等待执行的任务队列）
  }

  // 添加任务的方法
  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      // 1. 把真正的任务连同它的 resolve/reject 打包成一个函数，塞进队伍里
      // 为什么要打包？因为我们要控制它【什么时候开始执行】，而不是一添加就执行
      this.queue.push(() => {
        // 执行原始任务，并将结果传递出去
        return promiseCreator().then(resolve, reject);
      });

      // 2. 每次队伍里来新人了，都尝试去大堂看一眼有没有空窗口
      this.run();
    });
  }

  // 核心调度逻辑
  run() {
    // 如果窗口全满了，或者大厅里根本没人排队，就什么都不做
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    // 走到这里，说明【有空窗口】且【有人排队】
    this.activeCount++; // 占用一个窗口
    const task = this.queue.shift(); // 叫号：队伍最前面的人出列

    // 开始办理业务
    task().finally(() => {
      // finally 的精髓：不管这个请求最后是成功还是失败，只要结束了，就把窗口空出来
      this.activeCount--;

      // 这个人办完了，窗口空出来了，赶紧再去大厅看一眼，叫下一个人
      this.run();
    });
  }
}

// 模拟一个异步请求，经过指定时间后返回结果
const timeout = (time, data) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), time);
  });

// 初始化一个最大并发数为 2 的调度器
const scheduler = new Scheduler(2);

// 辅助函数：把任务丢进调度器，并打印完成时间
const addTask = (time, order) => {
  // scheduler.add 接收的是一个返回 Promise 的函数 (promiseCreator)
  scheduler.add(() => timeout(time, order)).then((res) => console.log(res));
};

// 疯狂派发任务
addTask(1000, "任务 1 结束"); // 耗时 1s
addTask(500, "任务 2 结束"); // 耗时 0.5s
addTask(300, "任务 3 结束"); // 耗时 0.3s
addTask(400, "任务 4 结束"); // 耗时 0.4s

/* 执行顺序解析：
  一开始，任务 1 和 2 占用窗口。
  0.5s 后，任务 2 完成，打印 "任务 2 结束"。腾出窗口，任务 3 进去。
  0.8s 后 (0.5+0.3)，任务 3 完成，打印 "任务 3 结束"。腾出窗口，任务 4 进去。
  1.0s 后，任务 1 完成，打印 "任务 1 结束"。腾出窗口，但没人排队了。
  1.2s 后 (0.8+0.4)，任务 4 完成，打印 "任务 4 结束"。
*/
