// https://molunerfinn.com/vue-components/#Notice
import Vue from 'vue';
import ProgressBar from './index.vue';

const ProgressBarConstructor = Vue.extend(ProgressBar); // 直接将Vue组件作为Vue.extend的参数

let nId = 1;

export const progressBar = progress => {
  let id = 'progress-bar-' + nId++;

  const ProgressBarInstance = new ProgressBarConstructor({
    data: {
      progress: progress
    }
  }); // 实例化一个带有progress内容的ProgressBar

  ProgressBarInstance.id = id;
  ProgressBarInstance.vm = ProgressBarInstance.$mount(); // 挂载但是并未插入dom，是一个完整的Vue实例
  ProgressBarInstance.dom = ProgressBarInstance.vm.$el;
  document.body.appendChild(ProgressBarInstance.dom); // 将dom插入body
  ProgressBarInstance.dom.style.zIndex = nId + 1001; // 后插入的ProgressBar组件z-index加一，保证能盖在之前的上面
  return ProgressBarInstance.vm;
};

export default {
  install: Vue => {
    Vue.prototype.$progressBar = progressBar; // 将ProgressBar组件暴露出去，并挂载在Vue的prototype上
  }
};

// vue2 三种挂载方法
const MyComponent = Vue.extend({
  template: '<div>Hello!</div>'
});

// 创建并挂载到 #app (会替换 #app)
new MyComponent().$mount('#app');

// 同上
new MyComponent({ el: '#app' });

// 或者，在文档之外渲染并且随后挂载
const component = new MyComponent().$mount();
document.getElementById('app').appendChild(component.$el);
