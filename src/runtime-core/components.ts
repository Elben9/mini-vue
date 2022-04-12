export function createComponentInstance (vnode) {
  const component = {
    vnode,
    type: vnode.type
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

