// https://king-hcj.github.io/2020/12/11/upload-page/
import { React } from 'react';
import { notification, Button } from 'antd';

let SYSTEM_VERSION_KEY = 'SystemVersion';

// 弹窗是否已展示（可以改用闭包、单例模式等）
let uploadNotificationShow = false;

const onClose = () => {
  uploadNotificationShow = false;
};

const onRefresh = (new_hash, reload = false) => {
  // 更新localStorage版本号信息
  window.localStorage.setItem(SYSTEM_VERSION_KEY, new_hash);
  if (reload) {
    onClose();
    // 刷新页面
    window.location.reload(true);
  }
};

const openNotification = new_hash => {
  uploadNotificationShow = true;
  const btn = (
    <Button type="primary" size="small" onClick={() => onRefresh(new_hash, true)}>
      确认更新
    </Button>
  );
  notification.open({
    message: '版本更新提示',
    description: '检测到系统当前版本已更新，请刷新后使用。',
    btn,
    // 不自动关闭
    duration: 0,
    onClose: onClose
  });
};

// 获取hash
export const getHash = () => {
  // 如果提示弹窗没有展示
  if (!uploadNotificationShow) {
    // 在 js 中请求首页地址，这样不会刷新界面，也不会跨域

    fetch(`${window.location.origin}/index.html?time=${new Date().getTime()}`)
      .then(res => res.text())
      .then(res => {
        // 匹配index.html文件中引入的js文件是否变化（具体正则，视打包时的设置及文件路径而定）
        let new_hash = res.data && res.data.match(/\/static\/js\/main.(.*).js/);
        // console.log(res, new_hash);
        new_hash = new_hash ? new_hash[1] : null;
        // 查看本地版本
        let old_hash = window.localStorage.getItem(SYSTEM_VERSION_KEY);
        if (!old_hash) {
          // 如果本地没有，则存储版本信息
          onRefresh(new_hash);
        } else if (new_hash && new_hash != old_hash) {
          // 本地已有版本信息，但是和新版不同：版本更新，弹出提示
          openNotification(new_hash);
        }
      });
  }
};

// 组件使用
class VersionUpdateNotification extends React.Component {
  constructor(props) {
    super(props);
    // 首次执行
    getHash();
  }

  timer = null;
  componentDidMount() {
    // 10分钟检测一次
    timer = setInterval(() => {
      getHash();
    }, 600000);
  }

  componentWillUnmount() {
    // 页面卸载时清除
    clearInterval(timer);
  }
}
