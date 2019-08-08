import React from 'react';
import '../stylesheets/frame.scss';
import HamburgerMenu from 'react-hamburger-menu';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';

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
            document.querySelector('.navbar-hamburger').className = 'navbar-hamburger close';
            document.querySelector('.sidebar').className = 'sidebar close';
        }
        else{
            document.querySelector('.navbar-hamburger').classList = 'navbar-hamburger open';
            document.querySelector('.sidebar').className = 'sidebar open';
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
                    width={25}
                    height={15}
                    strokeWidth={3}
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
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-user">
                    <h1>{this.props.user.name}</h1>
                    <h2>{this.props.user.role}</h2>
                </div>
            </div>
            <Link to="/" className="sidebar-link">Dashboard</Link>
            <Link to="/checkout" className="sidebar-link">Checkout</Link>
            <Link to="/inventory" className="sidebar-link">Inventory</Link>
            <Link to="/customers" className="sidebar-link">Customers</Link>
            <Link to="/reports" className="sidebar-link">Reports</Link>
            <Link to="/settings" className="sidebar-link">Settings</Link>
            <a onClick={this.handleLogout}  className="sidebar-link">Logout</a>
        </aside>
        <main className="frame-main">
            {this.props.children}
        </main>
        <footer className="frame-footer">
         <p className="github-link"><a href="https://github.com/4R53N" target="_blank">Arsen Ohanyan</a></p>
        </footer>
         </div>
    )
    }
} 