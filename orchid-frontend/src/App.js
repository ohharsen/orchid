import React from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import './App.css';
import LoginComponent from './components/login.component';
import DashboardComponent from './components/dashboard.component';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false,
    }
    this.handleLogin = this.handleLogin.bind(this);
  }

  render(){
    return !this.state.isLoggedIn ?  <LoginComponent onClick={this.handleLogin} /> : <DashboardComponent />;
  };

  handleLogin(e){
    e.preventDefault();
    var form = e.target.parentNode;
    console.log(form.childNodes[0].value + ' ' + form.childNodes[1].value);
    this.setState({
      isLoggedIn: true
    });
  }
}

export default App;
