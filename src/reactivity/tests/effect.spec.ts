import { reactive } from '../reactive'
import { effect } from '../effect'
describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10
    })
    let nextAge
    // 收集依赖
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)
    // update
    user.age++
    expect(nextAge).toBe(12)
  })

  it('should return runner when call effect', () => {
    // 调用effect会返回一个fn(runner）， 调用runner时这个fn会再次执行传给effect内部的fn，调用内部的fn 会return
    // effect(fn) -> function(runner) -> fn -> return
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    const r = runner()
    // 验证内部函数是否再次执行
    expect(foo).toBe(12)
    // 验证返回值
    expect(r).toBe('foo')
  })

  // vue3中一样的测试 scheduler
  it('scheduler', () => {
    // 通过effect第二个参数给定一个名为scheduler的fn
    // 当effect第一次执行时，会执行fn
    // 当响应式对象发生set update时，不会执行fn，而是执行scheduler
    // 如果当执行runner时，会再次执行fn
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      // runner就是effect返回的fn
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })
})