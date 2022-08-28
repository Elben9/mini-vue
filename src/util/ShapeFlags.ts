export const enum ShapeFlags {
  ELEMENT = 1, // 转换为二进制后0001
  STATEFUL_COMPONENT = 1 << 1, // 转换为二进制后0010  (1左移1位)
  TEXT_CHILDREN = 1 << 2, // 转换为二进制后100  (1左移2位)
  ARRAY_CHILDREN = 1 << 3, // 转换为二进制后1000
}