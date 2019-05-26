import React, {Component} from 'react';
import { ContextConsumer } from '../../context/Context';
import  { Icon } from 'react-icons-kit';
import {ic_person} from 'react-icons-kit/md/ic_person';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { Setting as Config } from '../../services/Services';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            dropdown : false,
        }
    }

    

    dropdownToggle  = () => {
        this.setState({
            dropdown : !this.state.dropdown
        })
    }

    sidebarToggle = () => {
        this.props.wrapper.sidebarToggle()
    }

    logout = () => {
        localStorage.clear();
        this.props.ContextAction({
            type : "ADMIN_LOGOUT",
        })
        this.props.history.push(Config.basePath);
    }

    render(){
        return(
            <header className="header-section">
                <div className="header-container">
                    <div className="header-row">
                        <div className="header-left">
                            <span onClick={this.sidebarToggle}  className={`menu-toggle ${this.props.wrapper.state.sidebar ? "active" : ""}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                            <div className="header-brand">
                                <h1 id="panel-title" className="header-brand-title">
                                    Admin Header
                                </h1>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="header-right-menu">
                                <span onClick={this.dropdownToggle} className="header-user-icon"><Icon size={24} icon={ic_person} /></span>
                                {
                                    this.state.dropdown ? 
                                    <div className="profile-dropdown">
                                        <ul>
                                            <li><span>{this.props.ContextState.loginData.user_name}</span></li>
                                            <li><Link to={`${Config.basePath}`}>About</Link></li>
                                            <li><span onClick={this.logout}>Logout</span></li>
                                        </ul>
                                    </div>
                                    :
                                    ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}

export default ContextConsumer(Header);