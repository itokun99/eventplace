import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import UserTable from '../../components/UserTable';
import API from '../../services/Services';
import Modal from '../../components/Modal';
import { ContextConsumer } from '../../context/Context';

class Users extends Component {
    state = {
        users : [],
        user : {},
        tableIsLoading : true,
        showModal : false,
    }

    showModal = () => {
        this.setState({
            showModal : true,
        })
    }

    closeModal = () => {
        this.setState({
            showModal : false,
            user : {}
        })
    }

    getUser = async () => {
        let loginData = this.props.ContextState.loginData;
        let appkey = loginData.appkey;
        let params = {
            appkey : appkey
        }
        API.userGet(params).then((response) => {
            if(response.status){
                this.setState({
                    users : response.data
                }, () => {
                    console.log(this.state.users);
                })
            } else {
                if(response.code === 404){
                    this.setState({
                        users : []
                    })
                } else {
                    console.log(response);
                }
            }
        })
    }

    realtimeGetUser = () => {
        setInterval(() => {
            this.getUser();
        },1000)
    }


    componentDidMount(){
        document.getElementById('panel-title').innerText = "Users List";
        this.getUser();
        // this.realtimeGetUser();
    }
    render(){
        return(
            <>
                <div className="offer-section">
                    <div className="row">
                        <div className="col-12">
                            <div className="offer-main card">
                                
                                <div className="offer-header pb-3">
                                    <button className="btn btn-primary ">Button</button>
                                </div>

                                <div className="offer-body">
                                    <div className="table-responsive">
                                        <UserTable data={this.state.users} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.showModal ?
                        <Modal>
                            <div className="modal-header">
                                <h5 className="modal-title">Preview User</h5>
                                <span onClick={this.closeModal} className="modal-close">&times;</span>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive">
                                    <table className="table font-sm table-border">
                                        <thead>
                                            <tr>
                                                <th colSpan={2}>Information</th> 
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Foto</td>
                                                <td>{this.state.user.user_pic}</td>
                                            </tr>
                                            <tr>
                                                <td>Nama</td>
                                                <td>{this.state.user.user_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td>{this.state.user.user_email}</td>
                                            </tr>
                                            <tr>
                                                <td>Phone</td>
                                                <td>{this.state.user.user_phone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => this.handleEditButton(this.state.preview)} className="btn btn-primary">Edit</button>&nbsp;&nbsp;
                                <button onClick={() => this.deleteEvent(this.state.preview.event_id)} className="btn btn-danger">Delete</button>&nbsp;&nbsp;
                                <button onClick={this.closeModal} className="btn btn-secondary">Close</button>
                            </div>
                        </Modal>
                    :
                    ""
                }
            </>
        )
    }
}

export default ContentWrapper(ContextConsumer(Users));