// 检查日期是否有效
const isDateValid = (...val) => !Number.isNaN(new Date(...val).valueOf());

// 获取某月的第一天
function getStartDate(time) {
  const date = new Date(time || null);
  date.setDate(1); // 将当前时间的日期设置成第一天
  const year = date.getFullYear().toString().padStart(2, '0'); // 得到当前年份
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 得到当前月份（0-11月份，+1是当前月份）
  const day = date.getDate().toString().padStart(2, '0'); // 得到当前天数，实际是本月第一天，因为前面setDate(1) 设置过了
  return new Date(year + '-' + month + '-' + day); // 这里传入的是字符串
}
function getStartDate(time) {
  const date = new Date(time || null);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month - 1, 1);
}

// 获取某月的最后一天
function getEndDate(time) {
  const date = new Date(time || null);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  // 这里传入的是整数时间，返回的是下个月的第一天，因为月份是0-11
  const nextMonthFirthDay = new Date(year, month, 1).getTime(); // 下个月的第一天
  const oneDay = 1000 * 60 * 60 * 24; // 一天的时间毫秒数
  const endDay = new Date(nextMonthFirthDay - oneDay);
  const day = endDay.getDate(); // 本月最后一天
  return new Date(year + '-' + month + '-' + day);
}
function getEndDate(time) {
  const date = new Date(time || null);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month, 0);
}

// 获取某月有多少天
function getMonthDay(time) {
  const date = new Date(time || null);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month, 0).getDate();
}

// 获取某天的日期
function getDateByDay(d = 0) {
  const date = new Date();
  date.setDate(date.getDate() + d);
  const year = date.getFullYear().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return year + '-' + month + '-' + day;
}
// 获取明天的日期  getDateByDay(1)
// 获取今天的日期  getDateByDay(0)
// 获取昨天的日期  getDateByDay(-1)

// 计算两个日期之间的间隔
function dayDiff(d1, d2) {
  return Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / 86400000);
}

// 是否有效日期
function isDate(str) {
  return typeof str !== 'number' && str !== null && new Date(str).toString() !== 'Invalid Date';
}

// 判断日期是否为今天
function isToday(time) {
  const date = new Date(time || null);
  return date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);
}

// 日期转换 YYYY-MM-DD
function formatDate(time) {
  const date = new Date(time || null);
  return date.toISOString().slice(0, 10);
}
// 日期转换 YYYY-MM-DD HH:mm:ss
function formatTime(time) {
  const date = new Date(time || null);
  const iso = date.toISOString();
  return `${iso.slice(0, 10)} ${iso.substring(11, 8)}`;
}
// 秒数转换: HH:mm:ss
function formatSeconds(s) {
  return new Date(s * 1000).toISOString().substring(11, 8);
}

// dayjs常用方法

// 依赖 UTC 插件，才能正常运行
// import utc from 'dayjs/plugin/utc'
// import timezone from 'dayjs/plugin/timezone'
// dayjs.extend(utc)
// dayjs.extend(timezone)

// 本地时间
// dayjs().format() // 获取当前时间
// 格式化时间（除UTC以外的时间）【只是把时间转成YYYY-MM-DD格式，没有转成UTC时间】
const formatDate = (time, format = 'YYYY-MM-DD') => {
  // dayjs(time, format)
  return dayjs(time).format(format);
};

// UTC时间
// dayjs.utc().format() // 获取当前UTC时间
// 格式化UTC时间【只是把UTC时间转成YYYY-MM-DD格式，没有转成时区时间】
const formatUTCDate = (utcTime, format = 'YYYY-MM-DD') => {
  // dayjs.utc(utcTime, format)
  return dayjs.utc(utcTime).format(format);
};

// UTC => 本地时间/某个时区时间
const transformUTCToTime = (utcTime, format = 'YYYY-MM-DD', timezone) => {
  return timezone
    ? dayjs.utc(utcTime).tz(timezone).format(format) // UTC转某个时区时间
    : dayjs.utc(utcTime).tz().format(format); // UTC转本地时间
};
// dayjs.utc(utcTime).tz() === dayjs.utc(utcTime).local()

// 本地时间/某个时区时间 => UTC
const transformTimeToUTC = (time, format = 'YYYY-MM-DD', timezone) => {
  return timezone
    ? dayjs(time).tz(timezone).utc().format(format) // 某个时区时间转UTC
    : dayjs(time).utc().format(format); // 本地时间转UTC
};
// dayjs.tz(time, timezone) === dayjs(time).tz(timezone)

// 今天
// dayjs().format('YYYY-MM-DD')
// dayjs().format('YYYY-MM-DD HH:mm:ss') // 今天此刻时间
// dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss') // 今天 00:00:00
// dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss') // 今天 23:59:59
// 昨天
// dayjs().subtract(1, 'days').format('YYYY-MM-DD')
// dayjs().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss') // 昨天此刻时间
// dayjs().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss') // 昨天 00:00:00
// dayjs().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss') // 昨天 23:59:59

// 获取本周
// dayjs().day('1').format('YYYY-MM-DD') // 周一
// dayjs().day('7').format('YYYY-MM-DD') // 周日

// 获取本月
// dayjs().startOf('month').format('YYYY-MM-DD') // 本月第一天
// dayjs().endOf('month').format('YYYY-MM-DD') // 本月最后一天
// 获取上个月
// dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD') // 上个月第一天
// dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD') // 上个月最后一天

// 获取本年
// dayjs().startOf('year').format('YYYY-MM-DD') // 今年第一天
// dayjs().endOf('year').format('YYYY-MM-DD') // 今年最后一天
// 获取上一年
// dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD') // 上一年第一天
// dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD') // 上一年最后一天
