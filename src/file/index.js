// https://zhuanlan.zhihu.com/p/57700185

// url 转 base64
// 利用canvas.toDataURL的API转化成base64
// https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement
// canvas.toDataURL/canvas.toBlob
function urlToBase64(url) {
  return new Promise ((resolve,reject) => {
    let image = new Image();
    image.onload = function() {
      let canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      // 将图片插入画布并开始绘制
      canvas.getContext('2d').drawImage(image, 0, 0);
      // result
      let result = canvas.toDataURL('image/png')
      resolve(result);
    };
    // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
    image.setAttribute("crossOrigin",'Anonymous');
    image.src = url;
    // 图片加载失败的错误处理
    image.onerror = () => {
      reject(new Error('urlToBase64 error'));
    }
  })
}

let imgUrL = `http://XXX.jpg`
urlToBase64(imgUrL).then(res => {
  // 转化后的base64图片地址
  console.log('base64', res)
})


// base64 转 blob
function base64ToBlob({b64data = '', contentType = '', sliceSize = 512} = {}) {
  return new Promise((resolve, reject) => {
    // 使用 atob() 方法将数据解码
    let byteCharacters = decodeURIComponent(escape(window.atob(b64data))); // atob(b64data)
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = [];
      for (let i = 0; i < slice.length; i++) {
          byteNumbers.push(slice.charCodeAt(i));
      }
      // 8 位无符号整数值的类型化数组。内容将初始化为 0。
      // 如果无法分配请求数目的字节，则将引发异常。
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    let result = new Blob(byteArrays, {
      type: contentType
    })
    resolve(result)
  })
 }

 let base64 = base64.split(',')[1]
base64ToBlob({b64data: base64, contentType: 'image/png'}).then(res => {
  // 转后后的blob对象
  console.log('blob', res)
})


// blob 转 base64
// 利用fileReader的readAsDataURL，将blob转为base64
// https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
// FileReader.readAsArrayBuffer()/FileReader.readAsDataURL()/FileReader.readAsText()
blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      resolve(e.target.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(blob);
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'));
    };
  });
}

blobToBase64(blob).then(res => {
  // 转化后的base64
  console.log('base64', res)
})

// 下载
// 利用URL.createObjectURL为File对象、Blob对象创建临时的URL
// https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL
