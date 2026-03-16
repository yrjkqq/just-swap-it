// function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
//   const res: number[] = [];

//   for (let i = 0; i < nums1.length; i++) {
//     const n1 = nums1[i];

//     let n1OnNums2Index: number | null = null;
//     for (let j = 0; j < nums2.length; j++) {
//       const n2 = nums2[j];
//       if (n2 === n1) {
//         n1OnNums2Index = j;
//       }

//       if (n2 > n1 && n1OnNums2Index !== null) {
//         res.push(n2);
//         break;
//       }

//       if (j === nums2.length - 1) {
//         res.push(-1);
//       }
//     }
//   }

//   return res;
// }
// [4,1,2,3]

function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const stack: number[] = [];
  const dict: Map<number, number> = new Map();

  for (const num of nums2) {
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      const s = stack.pop()!;
      dict.set(s, num);
    }

    stack.push(num);
  }

  return nums1.map((v) => dict.get(v) ?? -1);
}

/**
{
  1:3,
  3:4,
  4:-1,
  2:-1
}
   */
