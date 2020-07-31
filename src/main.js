import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js' //  引入 element-ui
import 'element-ui/lib/theme-chalk/index.css' //  element-ul css样式
import './styles/element-ui.less' //  element-ui 自定义样式
import './styles/index.less' // 基础样式
import './styles/commen.less' //  共有样式
import mavonEditor from 'mavon-editor' //  引入 md 编辑器
import 'mavon-editor/dist/css/index.css' //  引入 md 编辑器样式

//  使用 v-charts 的 line 和 ring 图
import VeLine from 'v-charts/lib/line.common'
import VeRing from 'v-charts/lib/ring.common'
Vue.component(VeLine.name, VeLine)
Vue.component(VeRing.name, VeRing)

Vue.use(mavonEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
