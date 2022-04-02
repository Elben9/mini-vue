import { extend } from "../util"

// 用于存储当前的依赖
let activeEffect
// 是否进行依赖收集
let shouldTrack = false
export class ReactiveEffect {
  private _fn: any
  public scheduler: Function | undefined
  onStop?: () => void
  active = true
  deps = []
  constructor (fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run () {
    // 如果stop（）过，直接return  防止重新收集依赖
    if (!this.active) {
      return this._fn()
    }
    activeEffect = this
    shouldTrack = true
    const result = this._fn()
    shouldTrack = false
    return result
  }
  stop () {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect (effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

export function effect (fn, options:any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // 1. _effect.onStop = options.onStop
  // 2. Object.assign(_effect, options)
  extend(_effect, options)
  // 收集时立即执行一次
  _effect.run()
  const runner:any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

const targetMap = new Map()

export function track (target, key) {
  if (!isTracking()) return
  // target -> key -> dep
  // dep = new Set()
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  trackEffect(dep)

  // if (dep.has(activeEffect)) return
  // // dep存储了某个key下所有的effect传入的方法 (如foo 可能执行了多个effect， dep中就存储了很多个关于foo的effect）
  // dep.add(activeEffect)
  // // 反向存储 当前effect的class中定义一个deps数组，用于存储他相关的reactive对象中的key对应的dep
  // activeEffect.deps.push(dep)
}

export function trackEffect (dep) {
  if (dep.has(activeEffect)) return
  // dep存储了某个key下所有的effect传入的方法 (如foo 可能执行了多个effect， dep中就存储了很多个关于foo的effect）
  dep.add(activeEffect)
  // 反向存储 当前effect的class中定义一个deps数组，用于存储他相关的reactive对象中的key对应的dep
  activeEffect.deps.push(dep)
}

export function isTracking () {
  return shouldTrack && activeEffect !== undefined 
  // // 普通对象触发get -> track时，不收集依赖
  // if (!activeEffect) return
  // // stop过则不触发依赖
  // if (!shouldTrack) return
}

export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  triggerEffect(dep)
}

export function triggerEffect (dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function stop (runner) {
  runner.effect.stop()
}
