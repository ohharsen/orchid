import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';
import LoginComponent from './components/login.component';
import DashboardComponent from './components/dashboard.component';
import FrameComponent from './components/frame.component';
import SpinnerComponent from './components/spinner.component';
import InventoryComponent from './components/inventory.component';

class App extends React.Component {
  constructor(props){ 
    super(props);
    this.state = {
      isLoggedIn: false,
      fetching: true,
      user: null
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleFetching = this.handleFetching.bind(this);
  }

  componentDidMount(){
    axios.get('http://localhost:3001/users/').then((response) => {
      if(response.status === 200){
        this.setState({isLoggedIn: true, user: response.data.user, fetching: false});
      }
      }).catch(err => {
      this.setState({isLoggedIn: false, user: null, fetching: false});
    });
  }

  render(){
    return ( 
    <Router>
      {this.state.fetching || this.state.isLoggedIn === null ? <SpinnerComponent /> : ( //Show spinner until logged in status is set
      !this.state.isLoggedIn ?  <LoginComponent handleLogin={this.handleLogin} handleFetching={this.handleFetching} isLoggedIn={false} /> : (
      <FrameComponent onLogout={this.handleLogout} handleFetching={this.handleFetching} user={this.state.user}>
        <Switch>
          <Route exact path = "/" component={DashboardComponent}/>
          <Route exact path = "/login" render={() => <Redirect from="/login" to="/"/>}/>
          <Route exact path = "/inventory" component={InventoryComponent} />
        </Switch>
      </FrameComponent>
    )
      )}
    </Router>
    );
  };

  handleLogin(isLoggedIn, fetching){
   this.setState({isLoggedIn: isLoggedIn, fetching: fetching});
  }

  handleLogout(isLoggedIn, fetching){
    this.setState({isLoggedIn: isLoggedIn, fetching: fetching});
   }

   handleFetching(fetching){
     if(fetching) this.setState({fetching: true});
     else this.setState({fetching: false});
   }
}

export default App;
