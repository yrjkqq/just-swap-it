function dailyTemperatures(temperatures: number[]): number[] {
  const stack: number[] = [];
  const res: number[] = [];

  for (let i = 0; i < temperatures.length; i++) {
    const tmp = temperatures[i];
    while (stack.length > 0 && tmp > temperatures[stack[stack.length - 1]]) {
      const stackTop = stack.pop()!;

      res[stackTop] = i - stackTop;
    }

    stack.push(i);
    res[i] = 0;
  }

  return res;
}
