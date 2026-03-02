class Schedular {
  constructor(maxCon) {
    this.maxCon = maxCon;
    this.activeCount = 0;
    this.queue = [];
  }

  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        return promiseCreator().then(resolve, reject);
      });

      this.run();
    });
  }

  run() {
    if (this.activeCount >= this.activeCount || this.queue.length === 0) {
      return;
    }

    this.activeCount++;
    const task = this.queue.shift();
    task().finally(() => {
      this.activeCount--;
      this.run();
    });
  }
}
