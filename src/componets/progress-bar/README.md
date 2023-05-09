import ProgressBar from './ProgressBar.vue';

// 方法一：
const progressBar = new Vue(ProgressBar).$mount();
// 方法二：
const progressBar = new Vue.extend(ProgressBar).$mount()
// 插入
document.body.appendChild(progressBar.$el);
