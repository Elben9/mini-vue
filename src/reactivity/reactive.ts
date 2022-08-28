import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

const createActiveObject = (raw, baseHandlers) => {
  return new Proxy(raw, baseHandlers)
}

export const isReactive = (obj) => {
  return !!obj[ReactiveFlags.IS_REACTIVE]
}

export const isReadOnly = (obj) => {
  return !!obj[ReactiveFlags.IS_READONLY]
}

// 存储依赖
export const reactive = (raw) => {
  return createActiveObject(raw, mutableHandlers)
}

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
}

export const shallowReadonly = (raw) => {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

export const isProxy = (val) => {
  return isReactive(val) || isReadOnly(val)
}
