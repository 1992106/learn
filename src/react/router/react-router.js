import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';

// 路由基本用法
/**
 * 使用 <Route> 渲染一些内容有以下三种方式：
 * <Route component>
 * <Route render>
 * <Route children></Route>
 */

const App = () => {
  return (
    <Router>
      <div>
        <h1>Global Party Supplies, Inc</h1> // PATHS
        <Route component={Home} path="/" exact /> // "/"
        <Route component={About} path="/about" /> // "/about"
        <Route component={Support} path="/support" /> // "/support"
        <Route component={Dashboard} path="/dashboard" /> // "/dashboard"
        <Route component={Invoices} path="/dashboard/invoices" /> // "/dashboard/invoices"
        <Route component={Team} path="/dashboard/team" /> // "/dashboard/team"
        <Route component={Report} path="/dashboard/:reportId" /> // "/dashboard/:reportId"
      </div>
    </Router>
  );
};

// Route definition
<Route
  path="/dashboard/:reportId"
  render={props => {
    return <Report {...props} salesData={true} />;
  }}
/>;

const Report = ({ props, match }) => {
  return (
    <h1>
      {match.params.reportId} // "match" is from react-router And
      {props.salesData}
    </h1>
  );
};

// Link
const Dashboard = ({ match, history }) => {
  return (
    <div>
      <div>
        <Link to={`${match.url}/invoices`}>Invoices</Link>
        <Link to={`${match.url}/team`}>Team</Link>
      </div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/support">Support</Link>
        <a onClick={history.goBack}>Go Back</a>
      </div>
    </div>
  );
};

// 路由组件跳转的方式， 比如<Route component={Home}，Home是路由组件，会通过prop自动传入match、location、history

// 普通组件跳转三种方式
// 方法一：使用Redirect跳转
class Login extends React.Component {
  render() {
    let isLogin = true;
    if (isLogin) {
      return <Redirect to="/" />;
    } else {
      return; // 这里放没登陆之前的各种form表单
    }
  }
}
// 方法二（不推荐）：通过contextTypes获取router，使用history.push跳转
class Login extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  render() {
    const {
      history,
      route: { match, location }
    } = this.context.router;
    // history.push('/)
    return; // 这里放没登陆之前的各种form表单
  }
}
// 方法三（推荐）：通过withRouter创建新组件，会自动注入match、location、history
class Login extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  render() {
    const { match, location, history } = this.props;
    // history.push('/)
    return; // 这里放没登陆之前的各种form表单
  }
}
const LoginWithRouter = withRouter(Login);

// 函数组件：使用useHistory
// const history = useHistory()
// history('/')

// 函数组件使用useHistory,useLocation,useRouteMatch,useParams
// useRouteMatch和useParams都是获取路由params, 其中useRouteMatch包含params
