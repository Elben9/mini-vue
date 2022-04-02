import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _effect: any;
  private _value: any;
  private _dirty: boolean = true;
  constructor (getter) {
    // 传入ReactiveEffect schedule，在triggerEffect时触发，将dirty置为true，当再次get value时，重新执行effect run方法，再次执行传入的getter
    this._effect = new ReactiveEffect(getter, () => {
      this._dirty = true
    })
  }
  get value () {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed (getter) {
  const computedRef = new ComputedRefImpl(getter)
  return computedRef
}
