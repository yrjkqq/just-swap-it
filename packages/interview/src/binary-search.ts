// function binarySearch(arr: any[], target: any): number {
//   const midIndex = Math.floor(arr.length - 1 / 2);
//   const mid = arr[midIndex];

//   if (target > mid) {
//     return binarySearch(arr.slice(midIndex), target);
//   } else if (target == mid) {
//     return midIndex;
//   } else {
//     return binarySearch(arr.slice(0, midIndex), target);
//   }
// }

function binarySearch(arr: any[], target: any): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const midIndex = left + Math.floor((right - left) / 2);
    const mid = arr[midIndex];

    if (mid === target) {
      return midIndex;
    } else if (mid < target) {
      left = midIndex + 1;
    } else if (mid > target) {
      right = midIndex - 1;
    }
  }

  return -1;
}
