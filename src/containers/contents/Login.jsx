import React, {Component} from 'react';
import API, {Setting} from '../../services/Services';
import Alert from '../../components/Alert';
import { ContextConsumer } from '../../context/Context';

class Login extends Component {
    state = {
        loginData : {
            email : "",
            password : "" 
        },
        alertStatus : false,
        alertData : {
            type : "",
            message : ""
        }
    }

    handleTextChange = (input) => {
        let name = input.target.name;
        let loginData = {...this.state.loginData}

        switch(name){
            case "email":
                loginData.email = input.target.value;
                break;
            case "password":
                loginData.password = input.target.value;
                break;
            default:
                return false;
        }

        this.setState({
            loginData : loginData
        });
    }

    handleLoginAdmin =  () => {
        let loginData = {...this.state.loginData};
        let noValue = false;
        for(let key in loginData){
            if(loginData[key] === ""){
                noValue = true;
            }
        }
        if(noValue){
            alert("Form tidak boleh kosong!");
        } else {
            // login pakai unregistered key
            loginData.appkey = Setting.firstKey;
            API.adminLogin(loginData)
            .then((response) => {
                console.log(response);
                if(response.status){
                    let loginData = JSON.stringify(response.data);
                    window.localStorage.setItem('loginData', loginData);
                    this.setState({
                        alertStatus : true,
                        alertData: {
                            type : "success",
                            message : response.message
                        }
                    }, () => {
                        this.props.ContextAction({
                            type : "ADMIN_LOGIN",
                            data : JSON.parse(loginData),
                        })
                    })
                } else {
                    this.setState({
                        alertStatus : true,
                        alertData : {
                            type : 'warning',
                            message  : response.message
                        }
                    })
                }
            })
        }
    }

    render(){
        // console.log(this.props);
        return(
            <div className="login-section">
                <div className="login-content flat-card">
                    <div className="flat-card-header">
                        <h4 className="flat-card-title">Login Application</h4>
                    </div>
                    <div className="flat-card-body">
                        <div className="form-group m-0">
                            {this.state.alertStatus ? <Alert type={this.state.alertData.type} message={this.state.alertData.message} style={{textAlign: "center"}} /> : ""}
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input onChange={(e) => this.handleTextChange(e)} type="email" className="form-control" name="email" placeholder="your@mail.com" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input onChange={(e) => this.handleTextChange(e)} type="password" className="form-control" name="password" placeholder="*****" />
                        </div>
                        <div className="form-group m-0">
                            <button onClick={this.handleLoginAdmin} type="button" className="btn btn-primary btn-block">Login</button>
                        </div>
                    </div>
                    <div className="flat-card-footer">

                    </div>
                </div>
            </div>
        )
    }
}

export default ContextConsumer(Login);