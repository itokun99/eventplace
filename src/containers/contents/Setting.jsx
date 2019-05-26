import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';

class Setting extends Component {
    componentDidMount(){
        document.getElementById('panel-title').innerText = "Setting";
    }
    render(){
        return(
            <div className="offer-section">
                <div className="row">
                    <div className="col-12">
                        <div className="offer-main">
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default ContentWrapper(Setting);