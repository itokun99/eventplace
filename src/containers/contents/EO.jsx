import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API, { Setting } from '../../services/Services';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import Modal from '../../components/Modal';
import { ContextConsumer } from '../../context/Context';
import moment from 'moment';

class EventOrganizer extends Component {
    state = {
        eventOrganizers : [],
        eventOrganizer : {},
        showModal : false,
    }

    handlePreview = (eo_data) => {
        this.setState({
            eventOrganizer : eo_data
        }, () => {
            this.handleShowModal()
        })
    }

    handleEditButton = (eo_data) =>  {
        this.props.history.push(`${Setting.basePath}event-organizer/edit/${eo_data.user_id}`, {
            user_data : eo_data
        })
    }

    handleShowModal = () => {
        this.setState({
            showModal : true
        })
    }
    handleCloseModal = () => {
        this.setState({
            showModal : false,
            eventOrganizer : {}
        })
    }

    deleteUser = (user_id) => {
        let loginData = this.props.ContextState.loginData;
        let params = {
            appkey : loginData.appkey,
            user_id : user_id
        }
        let cof = window.confirm('Apakah anda yakin?');
        if(cof){
            API.deleteUser(params)
            .then((result) => {
                if(result.status){
                    alert(result.message);
                    this.getEventOrganizerData();
                    this.handleCloseModal();
                } else {
                    console.log(result)
                    alert(result.message);
                }
            })
        } else {
            return false;
        }
    }

    getEventOrganizerData = () => {
        let loginData = this.props.ContextState.loginData
        let params = {
            appkey : loginData.appkey
        }
        API.getEventOrganizer(params)
        .then((result) => {
            if(result.status){
                this.setState({
                    eventOrganizers : result.data
                });
            } else {
                if(result.code === 404){
                    this.setState({
                        eventOrganizers : []
                    })
                } else {
                    console.log(result.message);
                }
            }
        })
    }

    componentDidMount(){
        document.getElementById('panel-title').innerText = "List Event Organizer";
        document.title = "List Event Organizer"
        this.getEventOrganizerData();
    }

    render(){
        return(
            <>
                <div className="iopage-section">
                    <div className="row">
                        <div className="col-12">
                            <div className="iopage-main card">
                                <div className="iopage-top mb-3">
                                    <Link to={`${Setting.basePath}event-organizer/add`} className="btn btn-primary">Tambah Event Organizer</Link>
                                </div>
                                <div className="iopage-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover font-sm">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Nama</th>
                                                    <th>Email</th>
                                                    <th>Nama EO</th>
                                                    <th>Telepon</th>
                                                    <th>Tanggal</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.eventOrganizers.length > 0 ?
                                                    this.state.eventOrganizers.map((value, index) => {
                                                        return(
                                                            <tr key={index}>
                                                                <td>{index+1}</td>
                                                                <td style={{cursor : "pointer"}} onClick={() => this.handlePreview(value)}>{value.user_name}</td>
                                                                <td>{value.user_email}</td>
                                                                <td>{value.eo_data.eo_name}</td>
                                                                <td>{value.user_phone}</td>
                                                                <td>{moment(value.user_created_date).format("DD MMMM YYYY")}</td>
                                                                <td>{value.eo_data.eo_status === "1" ? "Active" : "Deactive"}</td>
                                                            </tr>    
                                                        )
                                                    })
                                                    :
                                                    <tr>
                                                        <td colSpan={7} style={{textAlign : "center"}}>No Data</td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.showModal ? 
                    <Modal size="medium">
                        <div className="modal-header">
                            <h4 className="modal-title">Preview EO</h4>
                            <span onClick={this.handleCloseModal} className="modal-close">&times;</span>
                        </div>
                        <div className="modal-body">
                            <div className="preview-main">
                                <div className="table-responsive">
                                    <table className="table table-bordered font-sm">
                                        <tbody>
                                            <tr>
                                                <td style={{width : 200}}>Logo/Pic</td>
                                                <td>
                                                    <img
                                                        width={200}
                                                        src={`${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath}${this.state.eventOrganizer.user_pic}`}
                                                        alt={this.state.eventOrganizer.eo_name}
                                                        title={this.state.eventOrganizer.eo_name}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Nama</td>
                                                <td>{this.state.eventOrganizer.user_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td>{this.state.eventOrganizer.user_email}</td>
                                            </tr>
                                            <tr>
                                                <td>Telepon</td>
                                                <td>{this.state.eventOrganizer.user_phone}</td>
                                            </tr>
                                            <tr>
                                                <td>Nama EO</td>
                                                <td>{this.state.eventOrganizer.eo_data.eo_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Bio</td>
                                                <td>{this.state.eventOrganizer.eo_data.eo_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Created</td>
                                                <td>{this.state.eventOrganizer.user_created_date}</td>
                                            </tr>
                                            <tr>
                                                <td>Status</td>
                                                <td>{this.state.eventOrganizer.eo_data.eo_status === "1" ? "Aktif" : "Tidak aktif"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick = {() => this.handleEditButton(this.state.eventOrganizer)} className="btn btn-primary">Edit</button>
                            <button onClick = {() => this.deleteUser(this.state.eventOrganizer.user_id)} className="ml-2 btn btn-danger">Delete</button>
                            <button onClick={this.handleCloseModal} className="ml-2 btn btn-secondary">Close</button>
                        </div>
                    </Modal>
                    :
                    ""
                }
            </>
        )
    }
}

export default ContentWrapper(ContextConsumer(EventOrganizer));