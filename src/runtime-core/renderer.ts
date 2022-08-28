import { createComponentInstance, setupComponent } from "./component"
import { isObject } from '../util/index';

/**
 * 
 * @param vnode 虚拟节点
 * @param container 容器
 */
export function render (vnode, container) {
  // patch
  patch(vnode, container)
}

function patch (vnode, container) {
  // ShapeFlags 标识虚拟节点有哪几种flag
  // vnode -> flag
  // element  componet: STATEFUL_COMPONENT  children: text_children array_children

  // 处理组件
  // 如何区分是element类型还是component类型? vnode.type
  // element类型的type是string，component类型是对象
  // if (typeof vnode.type === 'string') {
  //   processElement(vnode, container)
  // } else if (isObject(vnode.type)) {
  //   processComponent(vnode, container)
  // }
  // 以上内容更新为ShapeFlags判断
  const { ShapeFlags } = vnode
  if (ShapeFlags & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if (ShapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container)
  }
}

function processElement (vnode: any, container: any) {
  // mount
  mountElement(vnode, container)
  // update
}

function processComponent (vnode: any, container: any) {
  mountComponent(vnode, container)
}

// 创建element
function mountElement (vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type))
  const { children, props, ShapeFlags } = vnode
  // children: string array
  // if (typeof children === 'string') {
  //   el.textContent = children
  // } else if (Array.isArray(children)) {
  //   // vnode 遍历children 拿到每一个vnode，然后执行patch
  //   // children.forEach(v => {
  //   //   patch(v, el)
  //   // })
  //   mountChildren(vnode, el)
  // }
  // 以上改为ShapeFlags判断
  if (ShapeFlags & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (ShapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }
  for (const key in props) {
    if (Array.isArray(props[key])) {
      const value = props[key].reduce((prev, curr) => {
        return prev + ' ' + curr
      })
      el.setAttribute(key, value)
    } else {
      el.setAttribute(key, props[key])
    }
  }
  container.append(el)
}
// 创建component  initialVNode初始化vnode
function mountComponent (initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode)
  setupComponent(instance)
  SetupRenderEffectFn(instance, initialVNode, container)
}

function mountChildren (vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

function SetupRenderEffectFn (instance: any, initialVNode, container) {  
  const { proxy } = instance
  
  // vnode
  // const subTree = instance.render()
  // instance.render方法时在finishComponentSetup()时挂上来的
  const subTree = instance.render.call(proxy)

  // 根据返回的虚拟节点 进步patch vnode -> patch
  // vnode -> 现在是element类型 ->下一步应该 mountElement 挂载element
  // mountElement 在patch里做
  patch(subTree, container)
  
  // 此时mount完
  initialVNode.el = subTree.el
}
