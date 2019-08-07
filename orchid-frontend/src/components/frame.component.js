import React from 'react';
import '../stylesheets/frame.scss';
import HamburgerMenu from 'react-hamburger-menu';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

export default class FrameComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleClick() {
        if(this.state.open){
            //TODO Open and close the menu
        }
        this.setState({
            open: !this.state.open
        });
    }
    
    handleLogout(){
        this.props.onLogout({fetching: true});
        axios.post('http://localhost:3001/users/logout').then((response)=>{
            if(response.status === 200){
                console.log(this.props);
                this.props.onLogout({isLoggedIn: false, fetching: false});
            }
            else{
                //TODO error
            }
        });
    }

    render() {
        return (
        <div className="frame-container">
        <nav className="frame-navbar">
            <div className="navbar-hamburger">
                <HamburgerMenu
                    isOpen={this.state.open}
                    menuClicked={this.handleClick}
                    width={18}
                    height={15}
                    strokeWidth={2}
                    rotate={0}
                    color='#707070'
                    borderRadius={800}
                    animationDuration={0.4}
                />
            </div>
            <div className="navbar-logo">
                <p>orchid</p>
            </div>
            <div className="navbar-logout" onClick={this.handleLogout}>
                Logout
            </div>
        </nav>
        <main>
            {this.props.children}
        </main>
        <footer className="frame-footer">
         <p className="github-link"><a href="https://github.com/4R53N" target="_blank">Arsen Ohanyan</a></p>
        </footer>
         </div>
    )
    }
} 