
// 创建高阶组件
function withMouse(WrappedComponent) {
  // 改组件提供复用的状态逻辑
  class Mouse extends React.Component {
    state = {
      x: 0,
      y: 0
    };

    handleMouseMove = (e) => {
      this.setState({
        x: e.clientX,
        y: e.clientY
      });
    };

    componentDidMount() {
      window.addEventListener('mousemove', this.handleMouseMove);
    }

    componentWillUnmount() {
      window.removeEventListener('mousemove', this.handleMouseMove);
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  Mouse.displayName = `withMouse(${getDisplayName(WrappedComponent)})`;

  return Mouse;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const Position = (props) => {
  return (
    <p>
      鼠标位置：{props.x} {props.y}
    </p>
  );
}

const MousePosition = withMouse(Position);

class App extends React.Component {
  render() {
    return (
      <div>
        <MousePosition />
      </div>
    );
  }
}
