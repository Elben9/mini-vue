import { ShapeFlags } from '../util/ShapeFlags'
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
