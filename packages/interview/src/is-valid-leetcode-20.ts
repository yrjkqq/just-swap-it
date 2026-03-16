// function isValid(s: string): boolean {
//   const chars: string[] = [];

//   // 如果是左括号，入栈，如果是右括号，出栈

//   if (s.length <= 1) {
//     return false;
//   }

//   for (let i = 0; i < s.length; i++) {
//     const char = s[i];

//     if (char === "(" || char === "{" || char === "[") {
//       chars.unshift(char);
//     }

//     if (char === ")" || char === "}" || char === "]") {
//       const first = chars.shift();
//       if (
//         !first||
//         (first === "(" && char !== ")") ||
//         (first === "{" && char !== "}") ||
//         (first === "[" && char !== "]")
//       ) {
//         return false;
//       }
//     }
//   }

//   if (chars.length > 0) {
//     return false;
//   }

//   return true;
// }

function isValid(s: string): boolean {
  const stack: string[] = [];
  const charMap: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if (!charMap[char]) {
      stack.push(char);
    } else {
      if (stack.pop() !== charMap[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
