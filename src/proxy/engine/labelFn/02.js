// https://mp.weixin.qq.com/s/KHXhWX9KO6S5Ri86VCy5gw

// 模板字符串的国际化（i18n）
export const enUS = {
  'Welcome to': 'Welcome to',
  'you are visitor number': 'you are visitor number'
};
export const zhCN = {
  'Welcome to': '你好',
  'you are visitor number': '你的访问号码'
};

export function i18nInit(language, zhCNResource, enUSResource) {
  return (literals, ...values) => {
    let output = '';
    let index;
    let resource;
    // 根据当前语言获得语言包
    switch (language) {
      case 'zh-CN':
        resource = zhCNResource;
        break;
      case 'en-US':
        resource = enUSResource;
        break;
    }
    for (index = 0; index < values.length; index++) {
      output += resource[literals[index]] + values[index]; // 把字面量作为键得到语言包中对应的翻译
    }
    output += resource[literals[index]];
    return output;
  };
}

let currentLanguage = 'zh-CN';
const i18n = i18nInit(currentLanguage, zhCN, enUS);
i18n`Welcome to ${siteName}, you are visitor number ${visitorNumber}!`;
