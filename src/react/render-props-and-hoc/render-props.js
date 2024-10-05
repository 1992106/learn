// render props模式：鼠标位置复用
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

  // render() {
  //   return this.props.render(this.state)
  // }

  render() {
    return this.props.children(this.state)
  }
}

Mouse.propTypes = {
  // render: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired
}

class App extends React.Component {
  render() {
    return (
      <div>
        {/* <Mouse render={({ x, y }) => (
          <p>鼠标位置是 {x}, {y}</p>
        )} /> */}
        {/* children方式 */}
        <Mouse>{ ({ X, Y }) => <P>鼠标位置是 {x}, {y}</P>}</Mouse>
      </div>
    );
  }
}
