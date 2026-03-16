// 找字符串中 s = "abcabcbb" 中最长的不重复的一段

function lengthOfLongestSubstring(s: string): number {
  let maxLen = 0;
  let left = 0;
  const window = new Set<string>();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    while (window.has(char)) {
      window.delete(s[left]);
      left++;
    }

    window.add(char);

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
