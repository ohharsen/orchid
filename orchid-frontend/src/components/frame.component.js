import React from 'react';
import '../stylesheets/frame.scss';
import HamburgerMenu from 'react-hamburger-menu';
import axios from 'axios';
import {Redirect, NavLink} from 'react-router-dom';

export default class FrameComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open: false,
            hours:new Date().getHours(), 
            minutes: new Date().getMinutes(),
            seconds: new Date().getSeconds()
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
       
    }

    componentDidMount(){
        setInterval(()=>this.setState({hours:new Date().getHours(), minutes: new Date().getMinutes(), seconds: new Date().getSeconds()}), 1000);
    
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
        this.props.handleFetching(true);
        axios.post('http://localhost:3001/users/logout').then((response)=>{
            if(response.status === 200){
                this.props.onLogout( false,  false);
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
            <NavLink to="/" style={{display: "block", margin: "auto"}}>
                <div className="navbar-logo">
                    <p>orchid</p>
                </div>
            </NavLink>
            <div className="navbar-logout" onClick={this.handleLogout}>
                Logout
            </div>
        </nav>
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-user">
                    <h1>{this.props.user ? this.props.user.name: 'user'}</h1>
                    <h2>{this.props.user ? this.props.user.role: 'role'}</h2>
                </div>
            </div>
            <NavLink to="/" className="sidebar-link" onClick={this.handleClick}>Dashboard</NavLink>
            <NavLink to="/checkout" className="sidebar-link" onClick={this.handleClick}>Checkout</NavLink>
            <NavLink to="/inventory" className="sidebar-link" onClick={this.handleClick}>Inventory</NavLink>
            <NavLink to="/customers" className="sidebar-link" onClick={this.handleClick}>Customers</NavLink>
            <NavLink to="/reports" className="sidebar-link" onClick={this.handleClick}>Reports</NavLink>
            <NavLink to="/settings" className="sidebar-link" onClick={this.handleClick}>Settings</NavLink>
            <a href="" onClick={this.handleLogout}  className="sidebar-link">Logout</a>
        </aside>
        <aside className="time-counter">
            <TimeCounter hours={this.state.hours} minutes={this.state.minutes} seconds={this.state.seconds} />
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

function TimeCounter(props){
    return(
    <React.Fragment>
        <h1>{(props.hours < 10 ? '0': '') + props.hours}:{(props.minutes < 10 ? '0': '') + props.minutes}:{(props.seconds < 10 ? '0': '') + props.seconds}</h1>
    </React.Fragment>
    )
}