import React from 'react';
import '../stylesheets/login.css'

function LoginComponent(props){

    return (
      <div className="App">
        <div className='login-side'>
          <h1>LOGIN</h1>
          <div className="login-form">
            <form>
            <input type="text" id="username" placeholder="USERNAME"/>
            <input type="text" id="password" placeholder="********"/>
            <input type="submit" value="LOGIN" onClick={props.onClick}/>
            </form>
          </div>
        </div>
        <div className='decoration'>
          <h1>orchid</h1>
          </div>
      </div>
    );
  
  }


export default LoginComponent;