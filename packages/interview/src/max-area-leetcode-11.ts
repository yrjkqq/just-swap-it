// function maxArea(height: number[]): number {
//   let left = 0;
//   let right = height.length - 1;

//   let max = 0;

//   for (let i = 0; i < height.length; i++) {
//     max = Math.max(
//       max,
//       (height.length - 1 - i) * Math.min(height[i], height[height.length - 1]),
//     );

//     for (let j = 0; j < height.length; j++) {
//       max = Math.max(max, (j - i) * Math.min(height[i], height[j]));
//     }
//   }

//   return max;
// }

function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;

  let max = 0;

  while (left < right) {
    const leftHeight = height[left];
    const rightHeight = height[right];

    const width = right - left;

    // 1. 算当前面积
    max = Math.max(max, width * Math.min(leftHeight, rightHeight));

    // 2. 核心骨架：谁短，就放弃谁（移动谁）
    if (leftHeight <= rightHeight) {
      left++;
    } else {
      right--;
    }
  }

  return max;
}
