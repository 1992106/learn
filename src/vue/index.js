// https://segmentfault.com/a/1190000020620972
import Vue from 'vue';
const path = require('path');
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

// 注册components
const files = require.context('@/components', true, /\.vue$/);
files.keys().forEach(key => {
  const name = path.basename(key, '.vue'); // 获取文件名
  // const name = key.split('/').pop().replace(/\.\w+$/, '') // 获取文件名
  // PascalCase 帕斯卡命名法
  const componentName = upperFirst(camelCase(name)); //
  Vue.component(componentName, files(key).default || files(key));
});

// 注册directives
const files = require.context('@/directives', false, /\.js$/);
let directives = {};
files.keys().forEach(key => {
  directives = Object.assign(filters, files(key).default);
});
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]);
});

// 注册filters
const files = require.context('@/filters', false, /\.js$/);
let filters = {};
files.keys().forEach(key => {
  filters = Object.assign(filters, files(key).default);
});
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
