import { h } from '../../lib/mini-vue.esm.js'

window.self = null
export const App = {
  // <template></template>
  render () {
    window.self = this
    // setupState中的值放到this上
    // this.$el => 返回根节点 root element
    return h('div', { id: 'root', class: ['red', 'blue'], onClick () { console.log('click') } }, 'hi，' + this.msg)
    // return h('div', { id: 'root', class: ['red', 'blue'] }, [h('p', { class: 'red' }, 'hi，'), h('span', { class: 'blue' }, 'mini-vue')])
  },
  setup () {
    return {
      msg: 'mini-vue1'
    }
  }
}
 