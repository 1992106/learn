import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import storeShape from './storeShape';
import shallowEqual from './shallowEqual';
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
    // 当 mapDispatchToProps 为 null/undefined/false 时，使用默认值
    mapDispatchToProps = defaultMapDispatchToProps;
  }

  return function wrapWithConnect(WrappedComponent) {
    // 返回最终的容器组件
    return class Connect extends Component {
      static contextTypes = {
        store: storeShape
      };
      static displayName = `Connect(${getDisplayName(WrappedComponent)})`;

      constructor(props, context) {
        super(props, context);
        this.store = props.store || context.store;
        // 源码中是将 store.getState()给了this.state
        this.state = mapStateToProps(this.store.getState(), this.props);

        if (typeof mapDispatchToProps === 'function') {
          this.mappedDispatch = mapDispatchToProps(this.store.dispatch, this.props);
        } else if (typeof mapDispatchToProps === 'object') {
          // 传递了一个 actionCreator 对象过来
          this.mappedDispatch = bindActionCreators(mapDispatchToProps, this.store.dispatch);
        }
      }
      componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => {
          const mappedState = mapStateToProps(this.store.getState(), this.props);
          if (shallowEqual(this.state, mappedState)) {
            return;
          }
          this.setState(mappedState);
        });
      }
      componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
      }
      render() {
        return <WrappedComponent {...this.props} {...this.state} {...this.mappedDispatch} />;
      }
    };
  };
}

export default connect;
