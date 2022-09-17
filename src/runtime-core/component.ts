import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'

export function createComponentInstance (vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    emit: () => {}
  }

  component.emit = emit.bind(null, component) as any
  return component
}

export function setupComponent (instance) {
  // TODO
  initProps(instance, instance.vnode.props)
  // initSLots()

  // 初始化component （设置有状态的组件， 除了有状态的组件还有函数组件 无状态）
  setupStatefulComponent(instance)
}

function setupStatefulComponent (instance: any) {
  // 获取用户给到的配置 就是传入的type 实际为App
  // const Component = instance.vnode.type
  const Component = instance.type

  // TODO 实现组件代理对象 这里不是很理解 复习的时候！！！得再看看
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

    // 将props传入setup,然后去Proxy中作处理
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })
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
  // createApp时拿到的就是APP
  const Component = instance.type

  // if (Component.render) {
    instance.render = Component.render
  // } 
}

