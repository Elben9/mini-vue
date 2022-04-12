import { App } from './App.js'
import { createApp } from '../../lib/mini-vue.esm.js'

//  TODO 如何把字符串转换成container 并且放入到组件逻辑内
const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)
