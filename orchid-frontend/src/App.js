import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';
import LoginComponent from './components/login.component';
import DashboardComponent from './components/dashboard.component';
import FrameComponent from './components/frame.component';
import SpinnerComponent from './components/spinner.component';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: null
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount(){
    axios.get('http://localhost:3001/login').then((response) => {
      if(response.status === 200){
        this.setState({isLoggedIn: true});
      }
      }).catch(err => {
      this.setState({isLoggedIn: false});
    });
  }

  render(){
    return (
    <Router>
      {this.state.isLoggedIn === null ? <SpinnerComponent /> : ( //Show spinner until logged in status is set
      !this.state.isLoggedIn ?  <LoginComponent onClick={this.handleLogin} isLoggedIn={false} /> : (
      <Switch>
      <Route exact path = "/login" render={() => <Redirect from="/login" to="/"/>}/>
      <Route exact path = "/" component={FrameComponent}/>
      </Switch>
    )
      )}
    </Router>
    );
  };

  handleLogin(userObj){
   this.setState(userObj);
  }
}

export default App;
