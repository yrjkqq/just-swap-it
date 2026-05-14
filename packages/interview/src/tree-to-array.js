function treeToArray(tree) {
  // return tree.reduce((acc, curr) => {
  //   const { children, ...rest } = curr;
  //   return acc.concat(rest, children ? treeToArray(children) : []);
  // }, []);

  const result = [];
  const queue = [...tree];

  while (queue.length > 0) {
    const top = queue.shift();
    const { children, ...rest } = top;
    if (children) {
      queue.push(...children);
    }
    result.push(rest);
  }

  return result;
}
