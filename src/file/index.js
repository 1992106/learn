// https://zhuanlan.zhihu.com/p/57700185

// url 转 base64
// 利用canvas.toDataURL的API转化成base64
// https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement
// canvas.toDataURL/canvas.toBlob
function urlToBase64(url) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = function () {
      let canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      // 将图片插入画布并开始绘制
      canvas.getContext('2d').drawImage(image, 0, 0);
      // result
      let result = canvas.toDataURL('image/png');
      resolve(result);
    };
    // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
    image.setAttribute('crossOrigin', 'Anonymous');
    image.src = url;
    // 图片加载失败的错误处理
    image.onerror = () => {
      reject(new Error('urlToBase64 error'));
    };
  });
}

// let imgUrL = `http://XXX.jpg`
// urlToBase64(imgUrL).then(res => {
//   // 转化后的base64图片地址
//   console.log('base64', res)
// })

// base64 转 blob
function base64ToBlob({ b64data = '', contentType = '', sliceSize = 512 } = {}) {
  return new Promise((resolve, reject) => {
    // 使用 atob() 方法将数据解码
    let byteCharacters = decodeURIComponent(escape(window.atob(b64data))), // atob(b64data)
      byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize),
        byteNumbers = [];
      for (let i = 0; i < slice.length; i++) {
        byteNumbers.push(slice.charCodeAt(i));
      }
      // 8 位无符号整数值的类型化数组。内容将初始化为 0。
      // 如果无法分配请求数目的字节，则将引发异常。
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    let result = new Blob(byteArrays, {
      type: contentType
    });
    resolve(result);
  });
}

// let base64 = base64.split(',')[1]
// base64ToBlob({ b64data: base64, contentType: 'image/png' }).then(res => {
//   // 转后后的blob对象
//   console.log('blob', res)
// })

// blob 转 base64
// 利用fileReader的readAsDataURL，将blob转为base64
// https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
// FileReader.readAsArrayBuffer()/FileReader.readAsDataURL()/FileReader.readAsText()
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = e => {
      resolve(e.target.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(blob);
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'));
    };
  });
}

// blobToBase64(blob).then(res => {
//   // 转化后的base64
//   console.log('base64', res)
// })

// 利用URL.createObjectURL为File对象、Blob对象创建临时的URL
// https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL
/**
 * 下载图片/文件
 * @param url
 * @param fileName
 */
const download = (url, fileName) => {
  const aLink = document.createElement('a');
  aLink.style.display = 'none';
  aLink.href = url;
  aLink.download = fileName || '';
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
};

/**
 * 下载图片/文件-文件流
 * @param content
 * @param fileName
 * @param type
 */
const downloadByBlob = (content, fileName, type) => {
  const blob = new Blob([content], {
    type
  });
  // 生成ObjectURL
  const src = URL.createObjectURL(blob);
  // 下载
  download(src, fileName);
  // 释放URL对象
  URL.revokeObjectURL(src);
};

/**
 * 下载图片/文件-http url
 * @param url
 * @param fileName
 * @returns {Promise<void>}
 */
const downloadByUrl = async (url, fileName) => {
  const res = await fetch(url, {
    method: 'GET',
    responseType: 'blob',
    mode: 'cors',
    cache: 'no-cache'
  }).then(res => {
    return res.blob();
  });
  downloadByBlob(res, fileName, res.type);
};

/**
 * 压缩图片
 * @param src
 * @param width
 * @param height
 * @param quality
 * @returns {Promise<unknown>}
 */
const compressImage = (src, width, height, quality = 1) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    width = getPixelSize(width);
    height = getPixelSize(height);
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = () => {
      // 有宽度无高度时，等比例计算高度
      if (!isEmpty(width) && isEmpty(height)) {
        height = (width / image.width) * image.height;
      }
      // 有高度无宽度时：等比例计算宽度
      if (!isEmpty(height) && isEmpty(width)) {
        width = (height / image.height) * image.width;
      }
      if (isEmpty(width) && isEmpty(height)) {
        width = image.width;
        height = image.height;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      const canvasURL = canvas.toDataURL('image/*', quality);
      resolve(canvasURL);
    };
    image.onerror = err => {
      reject(err);
    };
    image.src = src;
  });
};
