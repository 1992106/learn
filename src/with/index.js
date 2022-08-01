const data = {
  prop: {
    value: 1
  }
};

// new Function + with
// new Function传参
function fnPropChain(data, propChainStr) {
  return new Function('obj', 'with(obj){return' + propChainStr + ';}')(data);
}

// new Function + with
// new Function不传参
function fnPropChain(data, propChainStr) {
  return new Function('with(data){return' + propChainStr + ';}')();
}

// eval + with
// eval不支持传参
function evalPropChain(data, propChainStr) {
  return eval('with(data){' + propChainStr + '}');
}
