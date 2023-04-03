// 创建自定义事件，并派发自定义事件
const triggerEvent = (el, eventType, detail) => {
  el.dispatchEvent(new CustomEvent(eventType, { detail }));
};

// 去除字符串中的html代码
const removeHtml = (str = '') => str.replace(/<[\/\!]*[^<>]*>/gi, '');

// 字符串前后去空
export const trim = string => {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
  // return (string || '').replace(/(^\s*)|(\s*$)/g, '');
};

// 去除所有空
export const allTrim = string => {
  return (string || '').replace(/\s/g, '');
};

// 获取当前子元素是其父元素下子元素的排位
const getIndex = el => {
  if (!el) {
    return -1;
  }
  let index = 0;
  do {
    index++;
  } while ((el = el.previousElementSibling));
  return index;
};

// 获取当前元素相对于document的偏移量
const getOffset = el => {
  const { top, left } = el.getBoundingClientRect();
  const { scrollTop, scrollLeft } = document.body;
  return {
    top: top + scrollTop,
    left: left + scrollLeft
  };
};

// 获取当前页面的滚动位置
const getScrollPosition = el => ({
  x: el.pageXOffset ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset ? el.pageYOffset : el.scrollTop
});

// fade动画
const fade = (el, type = 'in') => {
  el.style.opacity = type === 'in' ? 0 : 1;
  let last = Number(new Date());
  const tick = () => {
    const opacityValue =
      type === 'in' ? (Number(new Date()) - last) / 400 : -(Number(new Date()) - last) / 400;
    el.style.opacity = Number(el.style.opacity) + opacityValue;
    last = Number(new Date());
    if (type === 'in' ? Number(el.style.opacity) < 1 : Number(el.style.opacity) > 0) {
      requestAnimationFrame(tick);
    }
  };
  tick();
};

// 获取元素类型
const type = obj =>
  Object.prototype.toString
    .call(obj)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase();

// 父元素是否包含子元素
const elementContains = (parent, child) => parent !== child && parent.contains(child);

// 元素是否在视口可见
const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

// 获取标签内容（包含标签）
function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    let container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

// 复制
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', 'readonly');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

export const hasClass = (el, cls) => {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

export const addClass = (el, cls) => {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

export const removeClass = (el, cls) => {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ' ' + el.className + ' ';

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

// 获取查询对象
export const getQueryParams = (queryString = window.location.search) => {
  const searchParams = new URLSearchParams(queryString);
  return [...searchParams].reduce((cur, [key, value]) => ((cur[key] = value), cur), {});
};
export const getQueryParams = (url = window.location.href) => {
  const searchParams = new URL(url).searchParams;
  return [...searchParams].reduce((cur, [key, value]) => ((cur[key] = value), cur), {});
};
export const getQueryParams = url => {
  const paramArr = url.slice(url.indexOf('?') + 1).split('&');
  const params = {};
  paramArr.forEach(param => {
    const [key, value] = param.split('=');
    params[key] = decodeURIComponent(value);
  });
  return params;
};

// 获取查询字符串
export const getQueryString = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  searchParams.sort();
  return searchParams.toString();
};
export const getQueryString = (params: Record<string, string>) => {
  return Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
};

// 通过key获取查询字符串值
export const getQueryValue = (name: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(name);
};
export const getQueryValue = (name: string) => {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
};
export const getQueryValue = (name: string) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const value = window.location.search.substr(1).match(reg);
  return value != null ? decodeURIComponent(value[2]) : null;
};

// 解析html
export const parseHtml = (str: string, mimeType: DOMParserSupportedType = 'text/html') => {
  const domparser = new DOMParser();
  return domparser.parseFromString(str, mimeType);
};
export const parseHtml = (str: string) => {
  const doc = document.implementation.createHTMLDocument('');
  if (str.toLowerCase().indexOf('<!doctype') > -1) {
    doc.documentElement.innerHTML = str;
  } else {
    doc.body.innerHTML = str;
  }
  return doc;
};

// 序列化html
export const stringifyHtml = (html: HTMLElement) => {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(html);
};

// 转义HTML
export const encodeHTML = (str: string) => {
  let textNode = document.createTextNode(str);
  let div = document.createElement('div');
  div.append(textNode);
  return div.innerHTML;
};
export const encodeHTML = (str: string) => {
  if (typeof str == 'string') {
    return str.replace(/<|&|>/g, function (matches) {
      return {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;'
      }[matches];
    });
  }
  return '';
};

// 反转义HTML
export const decodeHTML = (str: string) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.childNodes[0].nodeValue;
};
export const decodeHTML = (str: string) => {
  if (typeof str == 'string') {
    return str.replace(/&lt;|&amp;|&gt;/g, function (matches) {
      return {
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&'
      }[matches];
    });
  }
  return '';
};

// 解析script
export const parseScripts = (str: string) => {
  const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi); // script正则
  return str.match(reg);
};
// 获取script url
export const getScriptUrls = (str: string) => {
  const reg = new RegExp(/src=['"]?([^'"]*)['"]?/i);
  const scripts = parseScripts(str) || [];
  return scripts.map(val => val.match(reg)?.[1]);
};
export const getScriptUrls2 = (str: string) => {
  const reg = new RegExp(/<script [^>]*src=['"]([^'"]+)[^>]*>/gi);
  const urls = [];
  str.replace(reg, function (_, url) {
    urls.push(url);
    return url;
  });
  return urls;
};

// 解析图片
export const parseImages = (str: string) => {
  const reg = new RegExp(/<img.*?(?:>|\/>)/gi); // image正则
  return str.match(reg);
};
// 获取图片url
export const getImageUrls = (str: string) => {
  const reg = new RegExp(/src=['"]?([^'"]*)['"]?/i);
  const imgs = parseImages(str) || [];
  return imgs.map(val => val.match(reg)?.[1]);
};
export const getImageUrls2 = (str: string) => {
  const reg = new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi);
  const urls = [];
  str.replace(reg, function (_, url) {
    urls.push(url);
    return url;
  });
  return urls;
};

// DOM2JSON 一个函数，可以把一个 DOM 节点输出 JSON 的格式
const dom2json = rootDom => {
  if (!rootDom) {
    return;
  }
  let rootObj = {
    tagName: rootDom.tagName,
    children: []
  };
  const children = rootDom.children;
  // 读取子节点（元素节点）
  if (children && children.length) {
    Array.from(children).forEach((ele, i) => {
      // 递归处理
      rootObj.children[i] = dom2json(ele);
    });
  }
  return rootObj;
};

export const is32bit = (char: string) => {
  //如果码点大于了16位二进制的最大值，则其是32位的
  return char.codePointAt(0) > 0xffff;
};

export const getStringLen = (str: string) => {
  return Array.from(str).length;
};

const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil((difference / duration) * 50);

  function scroll(start, end, step) {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = start + step > end ? end : start + step;
    if (start > end) {
      d = start - step < end ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }
  scroll(from, to, step);
};
