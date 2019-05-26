import React, {Component, createContext} from 'react';

const Context = createContext();
const Provider = Context.Provider;
const Consumer = Context.Consumer;

const ContextProvider = (ChildrenComponent) => {
    return(
        class ParentComponent extends Component {
            state = {
                siteTitle : "PayCrack",
                isLogin : false,
                loginData : {}
            }

            handleCheckLogin = () => {
                if(window.localStorage.hasOwnProperty('loginData')){
                    let loginData = JSON.parse(window.localStorage.loginData);
                    if(loginData.hasOwnProperty('user_email')){
                        this.setState({
                            isLogin : true,
                            loginData : loginData
                        })
                    }
                }
            }

            dispatch = (action) => {
                let loginData = {...this.state.loginData};
                let isLogin = this.state.isLogin;
                switch(action.type){
                    case "ADMIN_LOGIN":
                        loginData = action.data;
                        isLogin = true;
                        break;
                    case "ADMIN_LOGOUT":
                        loginData = {};
                        isLogin = false;
                        break;

                    default:
                        return false;
                }
                this.setState({
                    isLogin : isLogin,
                    loginData : loginData
                });
            }

            componentDidMount(){
                this.handleCheckLogin();
            }

            render(){
                let ContextData = {
                    ContextState : this.state,
                    ContextAction : this.dispatch
                }
                return(
                    <Provider value={ContextData}>
                        <ChildrenComponent {...this.props} />
                    </Provider>
                )
            }
        }
    )
}

export const ContextConsumer = (ChildrenComponent) => {
    return(
        class ParentComponent extends Component {
            render(){
                return(
                    <Consumer>
                        {
                            (value) => {
                                return(
                                    <ChildrenComponent {...value} {...this.props} />
                                )
                            }
                        }
                    </Consumer>
                )
            }
        }
    )
}

export default ContextProvider;