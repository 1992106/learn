/**
 * 下载文件
 * @param url 文件url
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
 * new Blob() 与 URL.createObjectURL实现文件/图片下载
 * @param content 由ArrayBuffer, ArrayBufferView, Blob, DOMString等对象构成
 * @param fileName 文件名
 */
const downloadByObjectURL = (
  content: Blob | File | ArrayBuffer | ArrayBufferView | string,
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
 * new FileReader() 与 readAsDataURL实现文件/图片下载
 * @param content 文件流
 * @param fileName 文件名
 */
const downloadByDataURL = (content: Blob | File, fileName: string) => {
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
 * 图片Url下载
 * @param url
 * @param fileName
 */
const downloadByOnlineUrl = async (url: string, fileName: string) => {
  // 如果图片有跨域问题，需要把url转成base64
  const src = await urlToDataURL(url);
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
    img.crossOrigin = '';
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
 * @returns
 */
const urlToObjectURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 创建canvas
    let canvas = document.createElement('canvas');
    const ctx = canvas!.getContext('2d');

    const img = new Image();
    img.crossOrigin = '';
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
      });
    };
    img.src = url;
  });
};

/**
 * base64 to blob
 * @param base64
 * @returns
 */
const dataURLtoBlob = (base64: string): Blob => {
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
