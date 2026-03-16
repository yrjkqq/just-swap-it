哈哈，被你抓包了！我前面怕你觉得太多一下子有压力，就先挑了最最核心的 5 个（加链表变 8 个）先给你试水。

既然你准备好“一波流”带走了，那咱们直接把剩下的 **12 个核心骨架**全部补齐，凑足 **Top 20 完整版武器库**！

这剩下的 12 个，涵盖了面试里经常用来“区分评级”的中等难度题（Medium）。只要把这些骨架背熟，至少能保证你在面试官面前**思路不断、能写出伪代码**。

直接上 Anki 卡片格式，你可以一键复制导入：

---

### 🗂️ 数组与区间 (Arrays & Intervals)

#### 🃏 卡片 9：二分查找 (Binary Search)
*   **正面:** 【算法骨架】有序数组中查找目标值，时间复杂度 $O(\log N)$。写出**二分查找**的 `while` 循环骨架，特别注意边界条件 `left <= right` 和 `mid` 的计算。
*   **背面:** 核心：左右指针不断折半。
    ```typescript
    function binarySearch(nums: number[], target: number): number {
      let left = 0, right = nums.length - 1;
      while (left <= right) { // 注意是 <=
        const mid = Math.floor((left + right) / 2); // 更好写法: left + Math.floor((right-left)/2)
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
      }
      return -1;
    }
    ```
*   **标签:** `#Interview::Algorithm::BinarySearch`

#### 🃏 卡片 10：区间合并 (Merge Intervals)
*   **正面:** 【算法骨架】处理时间段重叠问题（如日历会议冲突），如何写出**区间合并**的骨架？
*   **背面:** 核心：先按起点排序，然后遍历判断“当前起点的与上一个终点”是否重叠。
    ```typescript
    function merge(intervals: number[][]): number[][] {
      if (!intervals.length) return [];
      intervals.sort((a, b) => a[0] - b[0]); // 1. 按起点排序
      const res = [intervals[0]];
      
      for (let i = 1; i < intervals.length; i++) {
        const last = res[res.length - 1];
        const curr = intervals[i];
        if (curr[0] <= last[1]) { // 2. 重叠了，合并终点
          last[1] = Math.max(last[1], curr[1]);
        } else {                  // 3. 没重叠，直接推入新区间
          res.push(curr);
        }
      }
      return res;
    }
    ```
*   **标签:** `#Interview::Algorithm::Intervals`

#### 🃏 卡片 11：首尾夹击双指针 (Two Pointers - Opposite Ends)
*   **正面:** 【算法骨架】判断回文串，或者“盛最多水的容器”，如何用**首尾双指针**向中间靠拢？
*   **背面:** 核心：`left` 从头，`right` 从尾，根据条件移动。
    ```typescript
    function isPalindrome(s: string): boolean {
      let left = 0, right = s.length - 1;
      while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
      }
      return true;
    }
    ```
*   **标签:** `#Interview::Algorithm::TwoPointers`
*   

```
function dailyTemperatures(temperatures: number[]): number[] {
  // 1. 提前分配数组并填0，性能最佳，也省去了结尾清空残余栈的麻烦
  const res: number[] = new Array(temperatures.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < temperatures.length; i++) {
    const tmp = temperatures[i];
    // 2. 遇到今天比“栈顶那天的温度”高，说明栈顶那天终于等到了升温！
    while (stack.length > 0 && tmp > temperatures[stack[stack.length - 1]]) {
      const topIdx = stack.pop()!;
      // 3. 计算距离（几天后）
      res[topIdx] = i - topIdx;
    }
    // 4. 不管怎样，今天也要进栈，等待未来哪天比自己热
    stack.push(i);
  }
  return res;
}


```

---

### 🗂️ 栈与队列 (Stack & Queue)

#### 🃏 卡片 12：有效括号匹配 (Valid Parentheses)
*   **正面:** 【算法骨架】编译器解析或 JSON 校验底层机制：如何用**栈 (Stack)** 匹配括号？
*   **背面:** 核心：遇到左括号入栈，遇到右括号出栈对比。推荐用 Map 存映射。
    ```typescript
    function isValid(s: string): boolean {
      const stack: string[] = [];
      const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
      
      for (const char of s) {
        if (!map[char]) stack.push(char); // 是左括号，入栈
        else if (stack.pop() !== map[char]) return false; // 是右括号，出栈对比
      }
      return stack.length === 0; // 栈清空才算合法
    }
    ```
*   **标签:** `#Interview::Algorithm::Stack`

#### 🃏 卡片 13：单调栈 (Monotonic Stack)
*   **正面:** 【算法骨架】寻找数组中“下一个更大元素”（如股票每日温度），如何写出**单调栈**骨架？
*   **背面:** 核心：栈里存的是**索引**，保持栈内元素递减。遇到比栈顶大的，就说明找到了栈顶的“下一个更大值”。
    ```
    function nextGreaterElements(nums: number[]): number[] {
      const res = new Array(nums.length).fill(-1);
      const stack: number[] = []; // 存索引
      
      for (let i = 0; i < nums.length; i++) {
        // 当前元素大于栈顶元素时，说明栈顶找到了它的 Next Greater
        while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
          const index = stack.pop()!;
          res[index] = nums[i];
        }
        stack.push(i);
      }
      return res;
    }
    ```
*   **标签:** `#Interview::Algorithm::MonotonicStack`

---

### 🗂️ 回溯与动态规划 (Backtracking & DP)

#### 🃏 卡片 14：回溯算法万能模板 (Backtracking)
*   **正面:** 【算法骨架】求全排列、组合、子集问题，如何写出**回溯算法**的“选、调、撤”三步骨架？
*   **背面:** 核心：在递归前后，通过 `push` 和 `pop` 维护当前路径状态。
    ```typescript
    function backtrack(nums: number[], path: number[], res: number[][]) {
      if (path.length === nums.length) { // 1. 终止条件，收集结果
        res.push([...path]); // 必须浅拷贝！
        return;
      }
      for (let i = 0; i < nums.length; i++) {
        if (path.includes(nums[i])) continue; // 剪枝
        path.push(nums[i]);        // 2. 做选择
        backtrack(nums, path, res); // 3. 递归进入下一层
        path.pop();                // 4. 撤销选择 (回溯核心)
      }
    }
    ```
*   **标签:** `#Interview::Algorithm::Backtracking`

#### 🃏 卡片 15：动态规划 - 斐波那契模型 (DP - 1D)
*   **正面:** 【算法骨架】爬楼梯、斐波那契数列，如何写出最基础的 **一维 DP (动态规划)** 骨架？
*   **背面:** 核心：状态转移方程 `dp[i] = dp[i-1] + dp[i-2]`。
    ```typescript
    function climbStairs(n: number): number {
      if (n <= 2) return n;
      let prev1 = 1, prev2 = 2; // 空间优化：只存前两个状态
      
      for (let i = 3; i <= n; i++) {
        const curr = prev1 + prev2;
        prev1 = prev2;
        prev2 = curr;
      }
      return prev2;
    }
    ```
*   **标签:** `#Interview::Algorithm::DP`

#### 🃏 卡片 16：动态规划 - 极值问题 (DP - Min/Max)
*   **正面:** 【算法骨架】零钱兑换（凑齐目标金额的最少硬币数），如何初始化和转移 **DP 极值问题**？
*   **背面:** 核心：求最小，初始化为 `Infinity`。方程 `dp[i] = Math.min(dp[i], dp[i - coin] + 1)`。
    ```typescript
    function coinChange(coins: number[], amount: number): number {
      const dp = new Array(amount + 1).fill(Infinity);
      dp[0] = 0; // 凑 0 元需要 0 个硬币
      
      for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
          if (i - coin >= 0) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
          }
        }
      }
      return dp[amount] === Infinity ? -1 : dp[amount];
    }
    ```
*   **标签:** `#Interview::Algorithm::DP::CoinChange`

---

### 🗂️ 矩阵与网格图 (Matrix / Grid)

#### 🃏 卡片 17：岛屿数量 (网格 DFS)
*   **正面:** 【算法骨架】二维网格遍历（如求岛屿数量），如何写出上下左右四个方向的 **网格 DFS** 骨架？
*   **背面:** 核心：沉岛策略（遍历过的置为 '0' 防止死循环），四向递归。
    ```typescript
    function numIslands(grid: string[][]): number {
      function dfs(r: number, c: number) {
        // 越界或遇到海水，返回
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === '0') return;
        
        grid[r][c] = '0'; // 沉岛，标记为已访问
        
        // 上下左右遍历
        dfs(r - 1, c); dfs(r + 1, c);
        dfs(r, c - 1); dfs(r, c + 1);
      }
      // 外层双重循环寻找未探索的陆地...
    }
    ```
*   **标签:** `#Interview::Algorithm::Graph::GridDFS`

---

### 🗂️ 字符串与高级结构 (Strings & Tries)

#### 🃏 卡片 18：前缀和 (Prefix Sum)
*   **正面:** 【算法骨架】求数组中“和为 K 的连续子数组”，为什么不能用滑动窗口？如何用 **前缀和 + 哈希表** 解决？
*   **背面:** 核心：因为数组可能有负数，滑动窗口会失效。用 Map 存前缀和出现的次数。
    ```typescript
    function subarraySum(nums: number[], k: number): number {
      const map = new Map<number, number>();
      map.set(0, 1); // 初始化：前缀和为 0 出现 1 次
      
      let sum = 0, count = 0;
      for (const num of nums) {
        sum += num;
        if (map.has(sum - k)) { // 找到了
          count += map.get(sum - k)!;
        }
        map.set(sum, (map.get(sum) || 0) + 1); // 记录当前前缀和
      }
      return count;
    }
    ```
*   **标签:** `#Interview::Algorithm::PrefixSum`

#### 🃏 卡片 19：字典树/前缀树 (Trie)
*   **正面:** 【算法骨架】前端 Search Bar 自动补全的底层结构：如何实现一棵 **Trie (字典树)** 的节点结构和 `insert` 方法？
*   **背面:** 核心：每个节点包含一个 `children` 对象和一个 `isEnd` 标志。
    ```typescript
    class TrieNode {
      children: Record<string, TrieNode> = {};
      isEnd: boolean = false;
    }
    class Trie {
      root = new TrieNode();
      insert(word: string): void {
        let node = this.root;
        for (const char of word) {
          if (!node.children[char]) node.children[char] = new TrieNode();
          node = node.children[char];
        }
        node.isEnd = true;
      }
    }
    ```
*   **标签:** `#Interview::Algorithm::Tree::Trie`

#### 🃏 卡片 20：Top K 问题 (JS 取巧法)
*   **正面:** 【面试话术】求数组中“第 K 大的元素”，标准解法是构建最小堆。在 JS 没有原生堆的情况下，如何给出 **最接地气且优雅的解法**？
*   **背面:** 核心：向面试官阐明理论（堆排序是 $O(N \log K)$），但展示用 JS 原生排序或快速选择（QuickSelect）更具工程性。
    ```typescript
    // 工程取巧法：
    function findKthLargest(nums: number[], k: number): number {
      // 面试官问为什么这么写：因为 V8 引擎内部做了极致优化（Timsort/快排混合），
      // 在业务场景中，手写二叉堆的常数时间消耗往往比原生 sort 还要慢。
      return nums.sort((a, b) => b - a)[k - 1]; 
    }
    ```
    *（注：如果面试官非要考算法，可以口述基于快排的 QuickSelect 逻辑，即每次 Partition 淘汰一半区间。）*
*   **标签:** `#Interview::Algorithm::Heap::TopK`

---

🎉 **20 大金刚集齐！** 
有了这 20 个骨架，你面对 90% 的前端 LeetCode 面试题都能“有码可写、有话可说”。这几天不用自己去抠边界条件的死角，重点是**能肌肉记忆写出这些核心骨架**，并且在写的时候**嘴上能顺畅地把逻辑念出来**，Aster 的前两轮绝对拿下！冲！****