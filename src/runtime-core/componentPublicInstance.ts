const publicPropertiesMap = {
  $el: (instance) => instance.vnode.el,
}
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // 从setupState获取值
    const { setupState } = instance
    if (key in setupState) {
      return setupState[key]
    }
    // if (key === '$el') {
    //   return instance.vnode.el
    // }
    const publicGeeter = publicPropertiesMap[key]
    if (publicGeeter) {
      return publicGeeter(instance)
    }
  },
}
