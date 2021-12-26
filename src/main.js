import Vue from 'vue'
import axios from 'axios'
import ViewUI from 'view-design'
import ElementUI from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import BaiduMap from 'vue-baidu-map'

import 'view-design/dist/styles/iview.css'
import './permission'
import 'element-ui/lib/theme-chalk/index.css'


Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(ElementUI)
 
Vue.use(BaiduMap, {
    
    // ak 是在百度地图开发者平台申请的密钥
    ak: 'thZcycPLPE6GLnrkN9qnyRQ2x9CmFXGw'
  })

Vue.prototype.$axios = axios

// axios.defaults.baseURL='http://192.168.1.107:8081/'
// axios.defaults.baseURL='http://192.168.1.6:8081/'
// axios.defaults.baseURL='http://192.168.1.4:8081/'
// axios.defaults.baseURL='http://192.168.1.112:8081/'
// axios.defaults.baseURL='http://192.168.0.44:8081/'
axios.defaults.baseURL='http://60.191.72.227:8081/'
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})