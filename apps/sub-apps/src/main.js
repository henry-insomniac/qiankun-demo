import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import AntdX from 'ant-design-x-vue'

const app = createApp(App)
app.use(router)
app.use(AntdX)
app.mount('#app')
