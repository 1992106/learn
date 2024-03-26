// https://mp.weixin.qq.com/s/WN3PAvT1gA-Mr0cxJ8xL9A
/**
 * Timer function that sets up a recurring timer to execute a callback function.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function timer() {
  var speed = 500,
    counter = 1,
    start = new Date().getTime();

  function instance() {
    var real = counter * speed,
      ideal = new Date().getTime() - start;

    counter++;

    var diff = ideal - real;
    form.diff.value = diff;

    window.setTimeout(function () {
      instance();
    }, speed - diff); // 通过系统时间进行修复
  }

  window.setTimeout(function () {
    instance();
  }, speed);
}
