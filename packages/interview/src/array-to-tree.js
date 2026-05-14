const flatData = [
  { id: 1, name: "总行", parentId: 0 },
  { id: 2, name: "研发中心", parentId: 1 },
  { id: 3, name: "前端部门", parentId: 2 },
  { id: 4, name: "分行", parentId: 1 },
];

const result = [
  {
    id: 1,
    children: [
      {
        id: 2,
        children: [
          {
            id: 3,
          },
        ],
      },
      {
        id: 4,
      },
    ],
  },
];

function arrayToTree(items) {
  const itemMap = {};
  const result = [];

  for (const item of items) {
    itemMap[item.id] = {
      ...item,
      children: [],
    };
  }

  for (const item of items) {
    const id = item.id;
    const pid = item.parentId;
    const treeItem = itemMap[id];

    if (pid === 0 || !itemMap[pid]) {
      result.push(treeItem);
    } else {
      itemMap[pid].children.push(treeItem);
    }
  }

  return result;
}
