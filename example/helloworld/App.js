import { h } from '../../lib/mini-vue.esm.js'

export const App = {
  // <template></template>
  render () {
    // return h('div', { id: 'root', class: ['red', 'blue'] }, 'hi，' + this.msg)
    return h('div', { id: 'root', class: ['red', 'blue'] }, [h('p', { class: 'red' }, 'hi，'), h('span', { class: 'blue' }, 'mini-vue')])
  },
  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}
 