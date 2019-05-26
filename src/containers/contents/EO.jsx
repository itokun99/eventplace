import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API, { Setting } from '../../services/Services';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import Modal from '../../components/Modal';
import { ContextConsumer } from '../../context/Context';

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
        this.props.history.push(`${Setting.basePath}admin/event-organizer/edit/${eo_data.eo_id}`, {
            data : eo_data
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
                                                                <td>{value.eo_status === "1" ? "Active" : "Deactive"}</td>
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
                                                        src={`${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath}${this.state.eventOrganizer.eo_pic}`}
                                                        alt={this.state.eventOrganizer.eo_name}
                                                        title={this.state.eventOrganizer.eo_name}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Name</td>
                                                <td>{this.state.eventOrganizer.eo_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td>{this.state.eventOrganizer.eo_email}</td>
                                            </tr>
                                            <tr>
                                                <td>Bio</td>
                                                <td>{this.state.eventOrganizer.eo_bio}</td>
                                            </tr>
                                            <tr>
                                                <td>Created</td>
                                                <td>{this.state.eventOrganizer.eo_date}</td>
                                            </tr>
                                            <tr>
                                                <td>Status</td>
                                                <td>{this.state.eventOrganizer.eo_status === "1" ? "Active" : "Deactive"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick = {() => this.handleEditButton(this.state.eventOrganizer)} className="btn btn-primary">Edit</button>
                            <button className="ml-2 btn btn-danger">Delete</button>
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