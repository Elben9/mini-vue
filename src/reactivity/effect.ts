class ReactiveEffect {
  private _fn: any
  constructor (fn, public scheduler?) {
    this._fn = fn
  }
  run () {
    activeEffect = this
    // this._fn()
    return this._fn()
  }
}

// 用于存储当前的依赖
let activeEffect

export function effect (fn, options:any = {}) {
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler)
  _effect.run()
  return _effect.run.bind(_effect)
}

const targetMap = new Map()
export function track (target, key) {
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

  dep.add(activeEffect)
}

export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}