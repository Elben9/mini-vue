class ReactiveEffect {
  private _fn: any
  constructor (fn) {
    this._fn = fn
  }
  run () {
    activeEffect = this
    this._fn()
  }
}

// 用于存储当前的依赖
let activeEffect

export function effect (fn) {
  const effect = new ReactiveEffect(fn)
  effect.run()
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
    effect.run()
  }
}