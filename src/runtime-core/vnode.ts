import { ShapeFlags } from '../util/ShapeFlags'
/**
 * @params type: 元素 组件
 */
export function createVNode (type, props?, children?) {
  const vnode = {
    type,
    props, 
    children,
    shapeFlags: getShapeFlags(type),
    el: null
  }
  
  // children 
  if (typeof children === 'string') {
    // 通过｜ 或运算符进行改变
    // vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.TEXT_CHILDREN
    vnode.shapeFlags |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN
  }

  return vnode
}

function getShapeFlags (type: any) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}
