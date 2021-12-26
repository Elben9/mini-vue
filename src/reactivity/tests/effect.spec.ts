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
})