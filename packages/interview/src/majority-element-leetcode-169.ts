function majorityElement(nums: number[]): number {
  let res = nums[0];
  let votes = 0;

  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];

    if (votes === 0) {
      res = element;
    }

    if (element !== res) {
      votes--;
    } else {
      votes++;
    }
  }

  return res;
}

// element res votes
// 3 3 1
// 2 3 0
// 3 3 1
