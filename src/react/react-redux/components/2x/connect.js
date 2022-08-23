import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import ReactReduxContext from './Context';

/**
 * mapStateToProps 默认不关联state
 * mapDispatchToProps 默认值为 dispatch => ({dispatch})，将 `store.dispatch` 方法作为属性传递给组件
 */
const defaultMapStateToProps = state => ({});
const defaultMapDispatchToProps = dispatch => ({ dispatch });
// 获取组件名
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function connect(mapStateToProps, mapDispatchToProps) {
  if (!mapStateToProps) {
    mapStateToProps = defaultMapStateToProps;
  }
  if (!mapDispatchToProps) {
    // 当 mapDispatchToProps 为 null/undefined/false...时，使用默认值
    mapDispatchToProps = defaultMapDispatchToProps;
  }

  return function wrapWithConnect(WrappedComponent) {
    // 返回最终的容器组件
    return class Connect extends Component {
      static contextType = ReactReduxContext;
      static displayName = `Connect(${getDisplayName(WrappedComponent)})`;

      constructor(props, context) {
        super(props);
        this.store = context.store;

        this.state = mapStateToProps(context.store.getState(), this.props);

        if (typeof mapDispatchToProps === 'function') {
          this.mappedDispatch = mapDispatchToProps(this.store.dispatch, this.props);
        } else {
          // 传递了一个 actionCreator 对象过来
          this.mappedDispatch = bindActionCreators(mapDispatchToProps, this.store.dispatch);
        }
      }

      shouldComponentUpdate() {
        if (this.state === mapStateToProps(this.store.getState())) {
          return false;
        }
        return true;
      }
      componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => {
          this.setState(mapStateToProps(this.store.getState()));
        });
      }
      componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
      }
      render() {
        return <WrappedComponent {...this.state} {...this.props} {...this.mappedDispatch} />;
      }
    };
  };
}

export default connect;
