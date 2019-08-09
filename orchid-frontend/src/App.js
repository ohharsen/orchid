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
      isLoggedIn: null,
      fetching: false,
      user: null
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount(){
    axios.get('http://localhost:3001/users/').then((response) => {
      if(response.status === 200){
        this.setState({isLoggedIn: true, user: response.data.user, fetching: false});
        console.log(response.data.user);
      }
      }).catch(err => {
      this.setState({isLoggedIn: false, user: null, fetching: false});
    });
  }

  render(){
    return (
    <Router>
      {this.state.fetching || this.state.isLoggedIn === null ? <SpinnerComponent /> : ( //Show spinner until logged in status is set
      !this.state.isLoggedIn ?  <LoginComponent onClick={this.handleLogin} isLoggedIn={false} /> : (
      <FrameComponent onLogout={this.handleLogout} user={this.state.user}>
        <Switch>
          <Route exact path = "/login" render={() => <Redirect from="/login" to="/"/>}/>
          <Route exact path = "/" component={DashboardComponent}/>
        </Switch>
      </FrameComponent>
    )
      )}
    </Router>
    );
  };

  handleLogin(userObj){
   this.setState(userObj);
  }

  handleLogout(userObj){
    this.setState(userObj);
   }
}

export default App;
