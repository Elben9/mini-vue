import { PublicInstanceProxyHandlers } from "./componentPublicInstance"

export function createComponentInstance (vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {}
  }
  return component
}

export function setupComponent (instance) {
  // TODO
  // initProps()
  // initSLots()

  // 初始化component
  setupStatefulComponent (instance)
}

function setupStatefulComponent (instance: any) {
  // 获取用户给到的配置 就是传入的type 实际为App
  const Component = instance.type

  // 实现组件代理对象
  instance.proxy = new Proxy({
    _: instance
  }, PublicInstanceProxyHandlers
    // 抽离出去,因为以后不光有$el,可能还有$其他的
    // {
    // get (target, key) {
    //   // 从setupState获取值
    //   const { setupState } = instance
    //   if (key in setupState) { 
    //     return setupState[key]
    //   }
    //   if (key === '$el') {
    //     return instance.vnode.el
    //   }
    // },
    // }
  )

  // 拿到setup
  const { setup } = Component

  if (setup) {
    // 如果有setup 执行，可能返回function object
    // 如果是function 认为返回的是render函数
    // 如果是object 放在实例上
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult (instance, setupResult: any) {
  // TODO function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

function finishComponentSetup (instance: any) {
  const Component = instance.type

  // if (Component.render) {
    instance.render = Component.render
  // } 
}

