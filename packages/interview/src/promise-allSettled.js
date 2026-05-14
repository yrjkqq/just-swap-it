function allSettled(promiseList) {
  return new Promise((resolve, reject) => {
    const settledCount = 0;
    const resultList = [];

    for (let index = 0; index < promiseList.length; index++) {
      const p = promiseList[index];

      Promise.resolve(p)
        .then((value) => {
          resultList[index] = {
            status: "fulfilled",
            value,
          };
        })
        .catch((reason) => {
          resultList[index] = {
            status: "rejected",
            reason,
          };
        })
        .finally(() => {
          settledCount++;
          if (settledCount === promiseList.length) {
            resolve(resultList);
          }
        });
    }
  });
}

function promiseCreator(delay) {
  return new Promise((resolve) => setTimeout(() => resolve(), delay));
}
allSettled([promiseCreator(50), promiseCreator(100), promiseCreator(200)]);
