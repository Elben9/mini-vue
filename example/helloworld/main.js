import { App } from './App.js'
import { createApp } from '../../lib/mini-vue.esm.js'

//  TODO 如何把字符串转换成container 并且放入到组件逻辑内 就是mount方法直接传#app字符串
// debugger
const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)
