import { effect } from '../effect'
import { reactive } from '../reactive'
import { isRef, ref, unRef, proxyRefs } from '../ref'
describe('ref', () => {
  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1,
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: 'xiaohong',
    }
    // proxyRefs get -> ref 返回.value
    // 不是ref 则直接返回
    const proxyUser = proxyRefs(user)
    expect(user.age.value).toBe(10)
    expect(proxyUser.age).toBe(10)
    expect(proxyUser.name).toBe('xiaohong')
    //  template
    // 不需要.value

    ;(proxyUser as any).age = 20
    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    proxyUser.age = ref(10)

    // ref -> 修改 .value
    // 如果原本就是ref 且替换的是ref 就可以直接替换
    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)
  })

  it('isRef', () => {
    const a = ref(1)
    const user = reactive({
      age: 1,
    })
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  })

  it('unRef', () => {
    const a = ref(1)
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1) 
  })
})
