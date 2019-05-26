import React, {Component} from 'react'
import ContentWrapper from '../ContentWrapper';

class Dashboard extends Component {
    componentDidMount(){
        document.getElementById('panel-title').innerText = "Dashboard";
    }

    render(){
        return(
            <div className="dashboard-content">
                Dashboard
            </div>
        )
    }
}

export default ContentWrapper(Dashboard);