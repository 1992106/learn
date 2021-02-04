import React from 'react';
import { Router, Link, navigate, useNavigate, Location } from '@reach/router';

const App = () => {
  return (
    <div>
      <h1>Global Party Supplies, Inc</h1>
      <Router>
        {' '}
        // PATHS
        <Home path="/" /> // "/"
        <About path="about" /> // "/about"
        <Support path="support" /> // "/support"
        <Dashboard path="dashboard">
          {' '}
          // "/dashboard"
          <Report path=":reportId" /> // "/dashboard/:reportId"
          <Invoices path="invoices" /> // "/dashboard/invoices"
          <Team path="team" /> // "/dashboard/team"
        </Dashboard>
      </Router>
    </div>
  );
};

// Route definition
<Report
  path="dashboard/:reportId" // static routes work too :)
  salesData={true}
></Report>;

// Params & Props
const Report = (props) => {
  return (
    <h1>
      {props.reportId}
      and
      {props.salesData}
    </h1>
  );
};

// Link
const Dashboard = () => {
  return (
    <div>
      <div>
        <Link to="invoices">Invoices</Link>
        <Link to="team">Team</Link>
      </div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/support">Support</Link>
        <Link to="../">Go Back</Link>
      </div>
    </div>
  );
};

// 路由组件跳转的方式，比如<Home path="/"/>，Home是路由组件，会通过prop自动传入navigate和location和路由params

// 普通组件跳转的方式
// 类组件：使用navigate跳转 navigate('/')

// 类组件中：
// 使用<Location></Location>组件传入prop.navigate和prop.location
// 使用<Match></Match>组件传入prop.match(路由params)

// 函数组件：使用useNavigate
// const navigate = useNavigate()
// navigate('/')

// 函数组件中：
// 使用useLocation,useMatch,useParams
// useMatch和useParams都是获取路由params, 其中useMatch包含params
