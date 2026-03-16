function mergeIntervals(intervals: [number, number][]): [number, number][] {
  intervals.sort((a, b) => a[0] - b[0]);

  let result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    // const nextArr = intervals[index];
    // const lastResult = result[result.length - 1];
    // const max = Math.max(
    //   lastResult[lastResult.length - 1],
    //   nextArr[nextArr.length - 1],
    // );

    const curr = intervals[i];
    const last = result[result.length - 1];

    if (curr[0] <= last[1]) {
      last[1] = Math.max(curr[1], last[1]);
    } else {
      result.push(curr);
    }
  }

  return result;
}
