// https://mp.weixin.qq.com/s/dgY6cKOju2UpUEQk-7jHJQ

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

// ! 树遍历5种方法
// 广度优先遍历 (仅只有一种方法,用循环实现)
function treeForeach(tree, func) {
  let node,
    list = [...tree];
  while ((node = list.shift())) {
    func(node);
    node.children && list.push(...node.children);
  }
}

// 深度优先遍历(有四种方法)
// 先序遍历(递归)
function treeForeach1(tree, func) {
  tree.forEach(data => {
    func(data);
    data.children && treeForeach1(data.children, func); // 遍历子级树
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

// ! 列表和树相互转换
// 列表转树(2个方法)
function listToTree(list = []) {
  let info = list.reduce((map, node) => ((map[node.id] = node), (node.children = []), map), {});
  return list.filter(node => {
    info[node.parentId] && info[node.parentId].children.push(node);
    return !node.parentId;
  });
}
function listToTree2(list = []) {
  const hashMap = {};
  let result = [];
  list.forEach(item => {
    const { id, parentId } = item;
    // 不存在时，先声明children树形
    if (!hashMap[id]) {
      hashMap[id] = {
        children: []
      };
    }
    hashMap[id] = {
      ...item,
      children: hashMap[id].children
    };
    // 处理当前的item
    const treeItem = hashMap[id];
    // 根节点，直接push
    if (!parentId) {
      result.push(treeItem);
    } else {
      // 也有可能当前节点的父节点还没有加入hashMap，所以需要单独处理一下
      if (!hashMap[parentId]) {
        hashMap[parentId] = {
          children: []
        };
      }
      // 非根节点的话，找到父节点，把自己塞到父节点的children中即可
      hashMap[parentId].children.push(treeItem);
    }
  });
  return result;
}

// ! 树转列表(3个方法)
// 递归实现
function treeToList(tree, result = [], level = 0) {
  tree.forEach(node => {
    result.push(node);
    node.level = level + 1;
    node.children && treeToList(node.children, result, level + 1);
  });
  return result;
}
// 循环实现
function treeToList2(tree) {
  let result = [];
  let queue = tree.map(node => ((node.level = 1), node));
  while (queue.length) {
    const node = queue.shift();
    const children = node.children;
    if (children && children.length) {
      const list = children.map(subNode => ((subNode.level = node.level + 1), subNode));
      queue.push(...list);
    }
    result.push(node);
  }
  return result;
}
function treeToList3(tree) {
  let result = tree.map(node => ((node.level = 1), node));
  for (let i = 0; i < result.length; i++) {
    const children = result[i].children;
    if (children && children.length) {
      let list = children.map(node => ((node.level = result[i].level + 1), node));
      result.splice(i + 1, 0, ...list);
    }
  }
  return result;
}

// ! 树结构=>筛选
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
      node.children = treeFilter2(node.children, func);
      return node.children.length;
    } else {
      return func(node);
    }
  });
}
const resultTree = treeFilter(treeFilter, node => node.id == '2-1');

// ! 树结构=>通过节点id查找节点
function getFindNode(tree = [], func) {
  for (const data of tree) {
    if (func(data)) return data;
    if (data.children) {
      const res = getFindNode(data.children, func);
      if (res) return res;
    }
  }
  return null;
}
const resultNode = getFindNode(tree, node => node.id === '2-1');

// ! 树结构=>通过节点id查找节点路径
function getFindNodePath(tree = [], func, path = []) {
  for (const data of tree) {
    path.push(data.id);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = getFindNodePath(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}
const resultPath = getFindNodePath(tree, node => node.id === '2-1');

// ! 获取所有父级节点
function getAllParentNodes(tree) {
  const parentList = [];
  tree.forEach(item => {
    if (item.children) {
      parentList.push(item);
      const temp = getAllParentNodes(item.children);
      if (temp.length) {
        parentList.push(...temp);
      }
    }
  });
  return parentList;
}

// ! 获取所有叶子节点(2个方法)
// 循环实现
function getAllLeafNodes(tree) {
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
// 递归实现
function getAllLeafNodes2(tree, list = []) {
  tree.forEach((item: any) => {
    if (item.children) {
      return getAllLeafNodes2(item.children, list);
    } else {
      list.push(item);
    }
  });
  return list;
}

// ! 获取树全路径列表
function getAllFullPath(tree) {
  const paths = []; //记录路径的arr
  for (let i = 0; i < tree.length; i++) {
    //遍历同层次所有节点
    if (tree[i].children && tree[i].children.length) {
      const list = getAllFullPath(tree[i].children); // 如果有子节点便继续深入，直到到达叶子节点
      for (let j = 0; j < list.length; j++) {
        paths.push([tree[i], ...list[j]]); // 子节点返回后将其返回的路径与自身拼接
      }
    } else {
      paths.push([tree[i]]); // 没有子节点的话，直接将自身拼接到paths中
    }
  }
  return paths;
}
