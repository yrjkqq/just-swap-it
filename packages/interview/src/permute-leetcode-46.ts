function permute(nums: number[]): number[][] {
  function backtrack(path: number[], used: Set<number>) {
    if (used.size >= nums.length) {
      return backtrack(path, used);
    }

    for (const num of nums) {
      if (!used.has(num)) {
        path.push(num);
      }
    }
  }
}
