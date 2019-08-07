import React from 'react'; 
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import '../stylesheets/login.scss';

axios.defaults.withCredentials = true;

class LoginComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: "gagulik",
      password: "gagulik",
      fetching: false
    }
    this.handleLogin = this.handleLogin.bind(this);
  }
  render(){
    return (
      <div className="login-container">
        <div className='login-side'>
          <h1>Login</h1>
          <div className="login-form">
            <form onSubmit={this.handleLogin}>
            <input type="text" id="username" placeholder="USERNAME" value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})}/>
            <input type="password" id="password" placeholder="********" value={this.state.password} onChange={(e)=>this.setState({password: e.target.value})}/>
            <input type="submit" value="LOGIN"/>
            </form>
          </div>
        </div>
        <div className='login-decoration'>
          <h1>orchid</h1>
          </div>
      </div>
    );
  }
  handleLogin(e){
    e.preventDefault();
    var form = e.target;
    var username = this.state.username; 
    var password = this.state.password;
    this.props.onClick({fetching: true});
    axios.post('http://localhost:3001/users/login', {
      username: username,
      password: password
    }).then((response) => {
      if(response.status === 200){
        this.props.onClick({isLoggedIn: true, fetching: false});
      }
      }).catch(err => {
      this.props.onClick({isLoggedIn: false, fetching: false});
    });
  }
  }


export default LoginComponent;