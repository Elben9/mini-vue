import { hasOwn } from "../util/index"

const publicPropertiesMap = {
  $el: (instance) => instance.vnode.el,
}
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // 从setupState获取值
    const { setupState, props } = instance
    // if (key in setupState) {
    //   return setupState[key]
    // } else if (key in props) {
    //   return props[key]
    // }
    // refactor
    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }


    // if (key === '$el') {
    //   return instance.vnode.el
    // }
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  },
}
