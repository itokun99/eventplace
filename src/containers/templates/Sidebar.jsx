import React, {Component} from 'react';
import{NavLink} from 'react-router-dom';
import { Setting } from '../../services/Services';


class Sidebar extends Component {
    sidebarToggle = () => {
        this.props.wrapper.sidebarToggle()
    }
    render(){
        return(
            <div className={`sidebar-section ${this.props.wrapper.state.sidebar ? "active" : ""}`}>
                <div className="sidebar-header">
                    <span>CP Panel.</span>
                    <span onClick={this.sidebarToggle} className="menu-close">
                        <span></span>
                        <span></span>
                    </span>
                </div>
                <div className="sidebar-body">
                    <ul className="sidebar-nav">
                        <li><NavLink exact to={`${Setting.basePath}`}>Dashboard</NavLink></li>
                        <li><NavLink  to={`${Setting.basePath}user`}>Users</NavLink></li>
                        <li><NavLink  to={`${Setting.basePath}event`}>Events</NavLink></li>
                        <li><NavLink  to={`${Setting.basePath}event-organizer`}>Event Organizer</NavLink></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Sidebar;