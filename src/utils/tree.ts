// https://mp.weixin.qq.com/s/dgY6cKOju2UpUEQk-7jHJQ

// ! 树遍历5种方法
let tree = [
  {
    id: '1',
    title: '节点1',
    children: [
      {
        id: '1-1',
        title: '节点1-1'
      },
      {
        id: '1-2',
        title: '节点1-2'
      }
    ]
  },
  {
    id: '2',
    title: '节点2',
    children: [
      {
        id: '2-1',
        title: '节点2-1'
      }
    ]
  }
];

// 广度优先遍历 (仅只有一种方法,用循环实现)
function treeForeach(tree, func) {
  let node,
    list = [...tree];
  while ((node = list.shift())) {
    func(node);
    node.children && list.push(...node.children);
  }
}
// 测试代码
treeForeach(tree, node => {
  console.log(node.title);
});

// 深度优先遍历(有四种方法)
// 先序遍历(递归)
function treeForeach1(tree, func) {
  tree.forEach(data => {
    func(data);
    data.children && treeForeach(data.children, func); // 遍历子级树
  });
}
// 先序遍历(循环)
function treeForeach2(tree, func) {
  let node,
    list = [...tree];
  while ((node = list.shift())) {
    func(node);
    node.children && list.unshift(...node.children);
  }
}
// 后序遍历(递归)
function treeForeach3(tree, func) {
  tree.forEach(data => {
    data.children && treeForeach(data.children, func); // 遍历子级树
    func(data);
  });
}
// 后序遍历(循环)
function treeForeach4(tree, func) {
  let node,
    list = [...tree],
    i = 0;
  while ((node = list[i])) {
    let childCount = node.children ? node.children.length : 0;
    if (!childCount || node.children[childCount - 1] === list[i - 1]) {
      func(node);
      i++;
    } else {
      list.splice(i, 0, ...node.children);
    }
  }
}

// 格式化树
/**
 * @param  {Array} tree 待转换的 tree
 * @param  {Object} map  键值对映射
 * @return {Array}      转换后的 tree
 */
function convertTree(tree, map) {
  const result = [];

  // 遍历 tree
  tree.forEach(item => {
    // 读取 map 的键值映射
    const label = item[map.label];
    const value = item[map.value];
    let children = item[map.children];

    // 如果有子节点，递归
    if (children) {
      children = convertTree(children, map);
    }

    result.push({
      label,
      value,
      children
    });
  });

  return result;
}
function formatTree(tree, map) {
  return tree.reduce((arr, item) => {
    const children = item[map.children];
    arr.push({
      label: item[map.label],
      value: item[map.value],
      ...(children ? { children: formatTree(children, map) } : {})
    });
  }, []);
}

// ! 列表和树相互转换
// 列表转树
function listToTree(list = []) {
  let info = list.reduce((map, node) => ((map[node.id] = node), (node.children = []), map), {});
  return list.filter(node => {
    info[node.parentId] && info[node.parentId].children.push(node);
    return !node.parentId;
  });
}
// 树转列表(2个方法)
// ! 递归实现
function treeToList1(tree, result = [], level = 0) {
  tree.forEach(node => {
    result.push(node);
    node.level = level + 1;
    node.children && treeToList1(node.children, result, level + 1);
  });
  return result;
}
// ! 循环实现
function treeToList2(tree) {
  let result = tree.map(node => ((node.level = 1), node));
  for (let i = 0; i < result.length; i++) {
    if (!result[i].children) continue;
    let list = result[i].children.map(node => ((node.level = result[i].level + 1), node));
    result.splice(i + 1, 0, ...list);
  }
  return result;
}

// ! 树结构筛选
function treeFilter(tree, func) {
  let treeClone = [...tree];
  return treeClone.filter(node => {
    node.children = node.children && treeFilter(node.children, func);
    return func(node) || (node.children && node.children.length);
  });
}
function treeFilter2(tree, func) {
  let treeClone = [...tree];
  return treeClone.filter(node => {
    if (node.children) {
      node.children = treeFilter(node.children, func);
      return node.children.length;
    } else {
      return func(node);
    }
  });
}
const resultTree = treeFilter(treeFilter, node => node.id == '2-1');

// ! 查找节点
function treeFindNode(tree, func) {
  for (const data of tree) {
    if (func(data)) return data;
    if (data.children) {
      const res = treeFindNode(data.children, func);
      if (res) return res;
    }
  }
  return null;
}
const resultNode = treeFindNode(tree, node => node.id === '2-1');

// ! 查找节点路径
function treeFindPath(tree, func, path = []) {
  if (!tree) return [];
  for (const data of tree) {
    path.push(data.id);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}
const resultPath = treeFindPath(tree, node => node.id === '2-1');

// 查找所有叶子节点(2个方法)
// ! 循环实现
function findAllLeafNode(tree) {
  let leafList = [];
  let node;
  let list = [...tree];
  while ((node = list.shift())) {
    if (node.children) {
      list.push(...node.children);
    } else {
      leafList.push(node);
    }
  }
  return leafList;
}
// ! 递归实现
function findAllLeafNode2(tree, list = []) {
  tree.forEach((item: any) => {
    if (item?.children) {
      return findAllLeafNode2(item.children, list);
    } else {
      list.push(item);
    }
  });
  return list;
}
