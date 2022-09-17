import { h } from "../../lib/mini-vue.esm.js"

export const Foo = {
  setup (props) {
    console.log('Foo props', props)
    props.count++
  },
  // 通过this访问props里的count。
  render () {
    return h('div', {}, 'foo: ' + this.count)
  }
}
