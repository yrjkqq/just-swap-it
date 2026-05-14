function allSettled(promiseList) {
  return new Promise((resolve, reject) => {
    const resolveCount = 0;
    const resultList = new Array(promiseList.length);

    if (promiseList.length === 0) {
      resolve([]);
    }

    for (let index = 0; index < promiseList.length; index++) {
      const p = promiseList[index];

      Promise.resolve(p)
        .then((value) => {
          resolveCount++;
          resultList[index] = value;
          if (resolveCount === promiseList.length) {
            resolve(resultList);
          }
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

function promiseCreator(delay) {
  return new Promise((resolve) => setTimeout(() => resolve(), delay));
}
allSettled([promiseCreator(50), promiseCreator(100), promiseCreator(200)]);
