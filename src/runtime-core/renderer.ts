import { createComponentInstance, setupComponent } from "./components"
import { isObject } from '../util/index';

export  function render (vnode, container) {
  // patch
  patch(vnode, container)
}

function patch (vnode, container) {
  // 处理组件

  // TODO 判断vnode是否element类型?
  // 如何区分是element类型还是component类型
  console.log(vnode.type, '查看element类型')
  // element类型的type是string，component类型是对象
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement (vnode: any, container: any) {
  // mount
  mountElement(vnode, container)
  // update
}

function processComponent (vnode: any, container: any) {
  mounteComponent(vnode, container)
}

// 创建element
function mountElement (vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type))
  const { children, props } = vnode
  // children: string array
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    // vnode 遍历children 拿到每一个vnode，然后执行patch
    // children.forEach(v => {
    //   patch(v, el)
    // })
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

// 创建component
function mounteComponent (vnode: any, container: any) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  SetupRenderEffectFn(instance, vnode, container)
}

function mountChildren (vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

function SetupRenderEffectFn (instance: any, vnode, container) {  
  const { proxy } = instance
  
  // vnode
  // const subTree = instance.render()
  const subTree = instance.render.call(proxy)

  // vnode -> patch
  // vnode -> 现在上element类型 -> mountElement 挂载element
  // mountElement 在patch里做
  patch(subTree, container)
  
  // 此时mount完
  vnode.el = subTree.el
}
