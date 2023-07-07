// https://juejin.cn/post/6995385715672481799
import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';

import LionetConfirm from '@/shared/components/LionetConfirm';

/** 检测版本更新 */
const VersionUpdateToast = () => {
  /** 当前hash值 */
  const curHash = useRef(null);
  /** 定时器 */
  const timer = useRef(null);
  const [visible, setVisible] = useState(false);

  /** 轮询间隔 */
  const pollingTime = useMemo(() => {
    return 30 * 60 * 1000;
  }, []);

  /** 获取最新hash值
   * timestamp-时间戳防止请求缓存
   */
  const fetchNewHash = useCallback(async () => {
    // 在 js 中请求首页地址不会更新页面
    const timestamp = new Date().getTime();
    const response = await axios.get(`${window.location.origin}?time=${timestamp}`);
    // 返回的是字符串，需要转换为 html
    const el = document.createElement('html');
    el.innerHTML = response.data;
    // 拿到 hash
    const newHashSrc = el
      .getElementsByTagName('head')[0]
      .getElementsByTagName('script')[0]
      .src.split('/');
    const newHash = newHashSrc[newHashSrc.length - 1].split('.')[1];
    console.log('fetchNewHash', curHash.current, newHash);
    if (newHash && newHash !== curHash.current && !visible) {
      // 版本更新，弹出提示
      setVisible(true);
    } else if (newHash && newHash === curHash.current && visible) {
      setVisible(false);
    }
  }, [visible]);

  /** 开启定时器 */
  const setTimer = useCallback(() => {
    timer.current = setInterval(fetchNewHash, pollingTime);
  }, [fetchNewHash, pollingTime]);

  /** 清除定时器 */
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  /** 获取当前hash */
  const getCurrentHash = useCallback(() => {
    const curHashSrc = document
      .getElementsByTagName('head')[0]
      .getElementsByTagName('script')[0]
      .src.split('/');
    // eslint-disable-next-line prefer-destructuring
    curHash.current = curHashSrc[curHashSrc.length - 1].split('.')[1];
  }, []);

  /** 获取hash */
  const getHash = useCallback(() => {
    getCurrentHash();
    fetchNewHash();
  }, [fetchNewHash, getCurrentHash]);

  /** 浏览器窗口是否显示隐藏 */
  const onVisibilityChange = useCallback(() => {
    // eslint-disable-next-line prefer-destructuring
    if (!document.hidden) {
      setTimer();
      getHash();
    } else {
      clearTimer();
    }
  }, [clearTimer, getHash, setTimer]);

  useEffect(() => {
    getHash();
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
