import './App.css';
import Login from './components/auth';
// import PrivateRoute from './utility/PrivateRoute';
// import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Component } from 'react';

export class App extends Component {

  render() {
    return (
      <div className="main-wrap">
        <Login/>
      </div>
    );
  }
}

export default App;
