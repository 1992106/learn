const fs = require('fs');

/**
 * 下载文件
 * @param url 文件url (DataURL、ObjectURL、仅支持同源链接下载)
 * 非同源链接会直接打开图片，需要把图片url转成DataURL/ObjectURL，如下：downloadByOnlineUrl
 * @param name 文件名
 * @param target
 */
const download = (url, name) => {
  // 创建可下载隐藏链接
  const eleLink = document.createElement('a');
  eleLink.style.display = 'none';
  // 设置文件url
  eleLink.href = url;
  // 设置文件名
  eleLink.setAttribute('download', name);
  // 插入a标签
  document.body.appendChild(eleLink);
  // 触发点击
  eleLink.click();
  // 移除a标签
  document.body.removeChild(eleLink);
};

/**
 *【文件/图片】下载
 * new Blob() 与 URL.createObjectURL（将二进制数据封装为Blob对象）
 * @param content 由ArrayBuffer, ArrayBufferView, Blob, DOMString等对象构成
 * @param fileName 文件名
 */
const downloadByObjectURL = (
  content: ArrayBuffer | ArrayBufferView | Blob | string,
  fileName: string,
  mime?: string
) => {
  const blob = new Blob([content], { type: mime || 'application/octet-stream' });
  // 生成ObjectURL
  const src = URL.createObjectURL(blob);

  // 下载
  download(src, fileName);

  // 释放URL对象
  URL.revokeObjectURL(src);
};

/**
 * 【文件/图片】下载
 * new FileReader() 与 readAsDataURL（将二进制数据封装为文件读取FileReader对象）
 * @param content 文件流
 * @param fileName 文件名
 */
const downloadByDataURL = (content: Blob, fileName: string) => {
  const fileReader = new FileReader();

  fileReader.onload = function () {
    // base64 url
    const src = fileReader.result;

    // 下载
    download(src, fileName);
  };

  // 生成DataURL
  fileReader.readAsDataURL(content);
};

/**
 * 【文件下载】
 * @param url 接口地址
 * @param fileName
 */
const downLoadFile = (url: string, fileName: string) => {
  fetch(url, {
    method: 'get',
    cache: 'no-cache'
  })
    .then(res => {
      return res.blob();
    })
    .then(content => {
      downloadByObjectURL(content, fileName);
      downloadByDataURL(content, fileName);
    });
};

/**
 * 【图片下载】（非同源链接会直接打开图片，所以需要把图片url转成DataURL/ObjectURL）
 * @param url
 * @param fileName
 */
const downloadByOnlineUrl = async (url: string, fileName: string) => {
  // 如果图片有跨域问题，需要把url转成base64
  const src = await urlToDataURL(url);
  // const src = await urlToObjectURL(url);
  // 下载
  download(src, fileName);
};

/**
 * url to DataURL (HTMLCanvasElement.toDataURL())
 * @param url 图片http地址
 * @param type
 * @returns
 */
const urlToDataURL = (url: string, type?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 创建canvas
    let canvas = document.createElement('canvas');
    const ctx = canvas!.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous'; // 图片跨域
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject();
      }
      canvas.height = img.height;
      canvas.width = img.width;
      // 将图片绘制到canvas中
      ctx.drawImage(img, 0, 0);
      // 获取base64 url
      const dataURL = canvas.toDataURL(type || 'image/png');
      resolve(dataURL);

      canvas = null;
    };
    img.src = url;
  });
};

/**
 * url to ObjectURL (HTMLCanvasElement.toBlob())
 * @param url 图片http地址
 * @param type
 * @returns
 */
const urlToObjectURL = (url: string, type?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 创建canvas
    let canvas = document.createElement('canvas');
    const ctx = canvas!.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous'; // 图片跨域
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject();
      }
      canvas.height = img.height;
      canvas.width = img.width;
      // 将图片绘制到canvas中
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        resolve(url);
        canvas = null;
        URL.revokeObjectURL(url);
      }, type || 'image/png');
    };
    img.src = url;
  });
};

/**
 * base64 to blob
 * @param base64
 * @returns
 */
const base64ToBlob = (base64: string): Blob => {
  const arr = base64.split(',');
  const type = arr[0].match(/:(.*?);/)![1];
  const binStr = atob(arr[1]);
  let n = binStr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = binStr.charCodeAt(n);
  }
  // for (let i = 0; i < n; i++) {
  //   u8arr[i] = binStr.charCodeAt(i);
  // }
  return new Blob([u8arr], { type: type || 'image/png' });
};

/**
 * blob to base64
 * @param content
 * @returns
 */
const blobToBase64 = (content: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', () => reject());
    reader.readAsDataURL(content);
  });
};

// 读取文件并将其行以数组格式存储
const readFileLines = filename => fs.readFileSync(filename).toString('UTF8').split('\n');
