type TreeNode = {
  left: TreeNode;
  right: TreeNode;
  value: string;
};

function dfs(t: TreeNode | null): any {
  if (!t) {
    return;
  }

  console.log(t.value);

  dfs(t.left);
  dfs(t.right);
}

function bfs(t: TreeNode | null): any {
  if (!t) {
    return;
  }

  const queue = [t];

  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node?.value);
    if (node?.left) {
      queue.push(node.left);
    }
    if (node?.right) {
      queue.push(node.right);
    }
  }
}
