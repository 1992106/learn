import { useContext, useState } from 'react'
import ReactReduxContext from './Context';

const defaultMapStateToProps = () => ({});
const defaultMapDispatchToProps = dispatch => ({ dispatch });

function connect(mapStateToProps, mapDispatchToProps) {
  if (!mapStateToProps) {
    mapStateToProps = defaultMapStateToProps;
  }
  if (!mapDispatchToProps) {
    // 当 mapDispatchToProps 为 null/undefined/false 时，使用默认值
    mapDispatchToProps = defaultMapDispatchToProps;
  }

  return function wrapWithConnect(WrappedComponent) {
    const Connect = (props) => {
      const Context = props.context || ReactReduxContext
      const { store } = useContext(Context);
      const { getState, dispatch, subscribe } = store;
      // 获取 state
      const [state, setState] = useState(mapStateToProps(getState(), props));
      // 获取 dispatch
      let dispatchProps = { dispatch };
      if (typeof mapDispatchToProps === 'function') {
        dispatchProps = mapDispatchToProps(dispatch, props);
      } else if (typeof mapDispatchToProps === 'object') {
        // 传递了一个 actionCreator 对象过来
        dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
      }
      // 订阅 state 变化
      useEffect(() => {
        const unsubscribe = subscribe(() => {
          const stateProps = mapStateToProps(getState(), props);
          setState({ ...stateProps });
        });
        return () => {
          unsubscribe();
        };
      }, [subscribe]);

      return <WrappedComponent {...props} {...state} {...dispatchProps} />;
    }

    return Connect;
  }
}

export default connect;
