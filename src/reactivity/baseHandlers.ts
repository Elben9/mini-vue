import { extend, isObject } from '../util'
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive'

const createGetter = (isReadonly = false, shallow = false) => (target, key) => {
  if (key === ReactiveFlags.IS_REACTIVE) {
    return !isReadonly
  } else if (key === ReactiveFlags.IS_READONLY) {
    return !!isReadonly
  }

  const res = Reflect.get(target, key)

  // shallowReadonly
  if (shallow) {
    return res
  }

  // 解决嵌套对象深层reactive和readonly
  if (isObject(res)) {
    return isReadonly ? readonly(res) : reactive(res)
  }

  if (!isReadonly) {
    track(target, key)
  }
  return res
}

const createSetter = () => (target, key, value) => {
  const res = Reflect.set(target, key, value)
  trigger(target, key)
  return res
}

// cache
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: function (target, key, value) {
    console.warn('readonly cannot set value')
    return true
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})
