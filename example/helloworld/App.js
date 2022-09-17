import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

console.log(Foo);

window.self = null
export const App = {
  name: 'App',
  // <template></template>
  render () {
    window.self = this
    // setupState中的值放到this上
    // this.$el => 返回根节点 root element
    return h('div', { id: 'root', class: ['red', 'blue'], onClick () { console.log('click') } }, [h('div', {}, 'hi' + this.msg), h(Foo, { count: 1 })])
    // return h('div', { id: 'root', class: ['red', 'blue'] }, [h('p', { class: 'red' }, 'hi，'), h('span', { class: 'blue' }, 'mini-vue')])
  },
  setup () {
    return {
      msg: 'mini-vue1'
    }
  }
}
 