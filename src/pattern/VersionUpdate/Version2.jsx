import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';

import LionetConfirm from '@/shared/components/LionetConfirm';

/** 检测版本更新 */
const VersionUpdateToast = () => {
  /** 当前版本号 */
  const curVersion = useRef(null);
  /** 定时器 */
  const timer = useRef(null);
  const [visible, setVisible] = useState(false);

  /** 轮询间隔 */
  const pollingTime = useMemo(() => {
    return 30 * 60 * 1000;
  }, []);

  /** 获取最新版本号
   * timestamp-时间戳防止请求缓存
   */
  const fetchNewVersion = useCallback(async () => {
    // 在 js 中请求首页地址不会更新页面
    const timestamp = new Date().getTime();
    const response = await axios.get(`${window.location.origin}?time=${timestamp}`);
    // 返回的是字符串，需要转换为 html
    const el = document.createElement('html');
    el.innerHTML = response.data;
    let newVersion = '';
    // 拿到 版本号
    const metaList = el.querySelectorAll('meta');
    if (metaList.length) {
      metaList.forEach(item => {
        if (item.name === 'version_no') {
          newVersion = item.content;
        }
      });
    }
    console.log('fetchNewVersion', curVersion.current, newVersion);
    if (newVersion && newVersion !== curVersion.current && !visible) {
      // 版本更新，弹出提示
      setVisible(true);
    } else if (newVersion && newVersion === curVersion.current && visible) {
      setVisible(false);
    }
  }, [visible]);

  /** 开启定时器 */
  const setTimer = useCallback(() => {
    timer.current = setInterval(fetchNewVersion, pollingTime);
  }, [fetchNewVersion, pollingTime]);

  /** 清除定时器 */
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  /** 获取当前版本号 */
  const getCurrentVersion = useCallback(() => {
    let version = '';
    const metaList = document.querySelectorAll('meta');
    if (metaList.length) {
      metaList.forEach(item => {
        if (item.name === 'version_no') {
          version = item.content;
        }
      });
    }
    curVersion.current = version;
  }, []);

  /** 获取当前版本号 */
  const getVersion = useCallback(() => {
    getCurrentVersion();
    fetchNewVersion();
  }, [fetchNewVersion, getCurrentVersion]);

  /** 浏览器窗口是否显示隐藏 */
  const onVisibilityChange = useCallback(() => {
    // eslint-disable-next-line prefer-destructuring
    if (!document.hidden) {
      setTimer();
      getVersion();
    } else {
      clearTimer();
    }
  }, [clearTimer, getVersion, setTimer]);

  useEffect(() => {
    getVersion();
    setTimer();
    return () => {
      clearTimer();
    };
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  /** 立即刷新 */
  const handleConfirm = useCallback(() => {
    setVisible(false);
    window.location.reload(true);
  }, []);

  return (
    <LionetConfirm
      visible={visible}
      isShowCancelBtn={false}
      confirmText="立即刷新"
      onConfirm={handleConfirm}
    >
      <span>发现新版本，请刷新后使用哦～</span>
    </LionetConfirm>
  );
};

export default memo(VersionUpdateToast);
