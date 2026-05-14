function retry(fn, max, delay) {
  return new Promise((resolve, reject) => {
    function attempt(currentTry) {
      fn.then(resolve).catch((error) => {
        if (currentTry > max) {
          reject(error);
          return;
        }
        setTimeout(() => {
          attempt(currentTry + 1);
        }, delay);
      });
    }

    attempt(1);
  });
}
