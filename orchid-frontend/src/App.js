import React from 'react';
import logo from './logo.svg';
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
    this.setState({
      isLoggedIn: true
    });
  }
}

export default App;
