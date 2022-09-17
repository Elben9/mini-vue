import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'
import { isObject } from '../util/index';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

const createActiveObject = (target, baseHandlers) => {
  if (!isObject(target)) {
    console.warn(`target ${target} must be object`)
    return target
  }
  return new Proxy(target, baseHandlers)
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
