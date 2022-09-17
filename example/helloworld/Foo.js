import { h } from "../../lib/mini-vue.esm.js"

export const Foo = {
  setup (props, { emit }) {
    const emitAdd = () => {
      console.log('emit add')
      emit('add', 1, 2)
      emit('add-foo', 6)
    }
    return {
      emitAdd
    }
  },
  // 通过this访问props里的count。
  render () {
    const btn = h('div', {
      onClick: this.emitAdd
    }, 'emitAdd')
    const foo = h('div', {}, 'foo: ' + this.count)
    return h('div', {}, [btn, foo])
  }
}
