import { trackEffect, triggerEffect, isTracking } from './effect'
import { hasChanged, isObject } from '../util'
import { reactive } from './reactive'

class RefImpl {
  private _value
  public dep
  private _rawValue
  public __v_isRef = true
  constructor (value) {
    // 保存原始值 在设置值时
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }
  get value () {
    trackRefValue(this)
    return this._value
  }
  set value (newValue) {
    // 如果设置新值则触发依赖
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue 
      this._value = convert(newValue)
      triggerEffect(this.dep) 
    }
  }
}

function trackRefValue (ref) {
  if (isTracking()) {
    trackEffect(ref.dep)
  }
}

function convert (value) {
  return isObject(value) ? reactive(value) : value
}

export const ref = (val) => {
  return new RefImpl(val)
}

export const isRef = (ref) => {
  return !!ref.__v_isRef
}

export const unRef = (ref) => {
  // 是ref  返回ref.value
  // 否则直接返回值
  return isRef(ref) ? ref.value : ref
}

export const proxyRefs = (objectWithRefs) => {
  return new Proxy(objectWithRefs, {
    get (target, key) {
      // 如果是ref 返回.value
      return unRef(Reflect.get(target, key))
    },
    set (target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}
