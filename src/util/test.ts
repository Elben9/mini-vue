const ShapeFlags = {
  element: 0,
  stateful_component: 0,
  text_children: 0,
  array_children: 0
}

// 优化： 使用位运算 0000
// 0001 -> element
// 0010 -> stateful
// 0100 -> text_children
// 1000 -> array_children

// 修改 |  查找 &
// | (两位都为0，则为0, 否则位1   一个为1，其值为1。)
// & (两位都为1，则为1)
// 0000 -> 0001    0000 ｜0001 =》 0001