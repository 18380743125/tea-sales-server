// 对评论数据进行加工处理
export function processComment(comments: any[]) {
  for (const item of comments) {
    if (!item.user) continue;
    if (item.user.avatar) {
      item.avatarUrl = item.user.avatar.filename;
    }
    item.name = item.user.name;
    item.roles = item.user.roles;
    delete item.user;
  }

  const map = new Map();
  const res = [];
  for (const item of comments) {
    // 顶级评论, 直接加入结果集中
    if (item.parentId === null) {
      res.push(item);
    }
    map.set(item.id, item);
  }
  // 将子级评论加入父评论的 children 数组中
  for (const item of comments) {
    if (item.parentId !== null) {
      // 找到父评论
      const parentItem = map.get(item.parentId);
      item.parentName = parentItem.name;
      item.parentRoles = parentItem.roles;
      if (!parentItem) continue;
      if (!parentItem.children) parentItem.children = [];
      parentItem.children.push(item);
    }
  }

  return res;
}
