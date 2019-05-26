import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import API, {Setting} from '../../services/Services';
import { ContextConsumer } from '../../context/Context';
import ContentWrapper from '../ContentWrapper';
import Modal from '../../components/Modal';
import moment from 'moment';

class EventList extends Component {
    constructor(props){
        super(props);
        this.state = {
            events : [],
            showModal : false,
        }
    }

    showModal = () => {
        this.setState({
            showModal : true
        })
    }

    closeModal = () => {
        this.setState({
            showModal : false
        })
    }

    previewEvent = (event) => {
        this.setState({
            preview : event
        }, () => {
            this.showModal()
        })
    }

    handleEditButton = (data) => {
        this.props.history.push(`${Setting.basePath}event/edit/${data.event_id}`, {
            event : data
        })
    }

    deleteEvent = (event_id) => {
        let loginData = this.props.ContextState.loginData;
        let conf = window.confirm("Want to delete this Event");
        if(conf){
            let data = {
                appkey : loginData.appkey,
                id : event_id
            }
            API.eventDelete(data)
            .then((response) => {
                if(response.status){
                    this.setState({
                        showModal : false,
                    },() => {
                        this.getEventList();
                        alert(response.message);
                    })
                } else {
                    console.log(response);
                    alert(response.message)
                }
            })
        } else {
            return false;
        }
    }

    getEventList = () => {
        let loginData = this.props.ContextState.loginData
        let params = {
            appkey : loginData.appkey
        }
        API.eventsGet(params)
        .then((result) => {
            if(result.status){
                this.setState({
                    events : result.data
                })
            } else {
                if(result.code === 404){
                    this.setState({
                        events : [...result.data]
                    })
                } else {
                    console.log(result);
                }
            }
        })
    }


    componentDidMount(){
        document.getElementById('panel-title').innerText = "List Event";
        document.title = "List Event"
        this.getEventList();
    }


    render(){
        return(
            <>
                <div className="event-list section">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="event-list-top mb-2">
                                    <Link to={`${Setting.basePath}event/add`} className="btn btn-primary">Tambah Event</Link>
                                </div>
                                <div className="event-list-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover font-sm">
                                            <thead>
                                                <tr>
                                                    <th style={{textAlign : "center", minWidth : 50}}>#</th>
                                                    <th style={{textAlign : "center", minWidth : 200}}>Nama Event</th>
                                                    <th style={{textAlign : "center", minWidth : 100}}>Kategory</th>
                                                    <th style={{textAlign : "center", minWidth : 150}}>Penyelenggara/EO</th>
                                                    <th style={{textAlign : "center", minWidth : 150}}>Kota</th>
                                                    <th style={{textAlign : "center", minWidth : 200}}>Tempat</th>
                                                    <th style={{textAlign : "center", minWidth : 150}}>Tanggal Event</th>
                                                    <th style={{textAlign : "center", minWidth : 100}}>Status</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    this.state.events.length > 0 ?
                                                    this.state.events.map((event, index) => {
                                                        return(
                                                            <tr key={event.event_id}>
                                                                <td style={{textAlign : "center"}}>{index+1}</td>
                                                                <td onClick={() => this.previewEvent(event)} style={{cursor : "pointer"}}>{event.event_name}</td>
                                                                <td style={{textAlign : "center"}}>{event.event_category}</td>
                                                                <td style={{textAlign : "center"}}>{event.event_author}</td>
                                                                <td style={{textAlign : "center"}}>{event.event_city}</td>
                                                                <td>{event.event_place}</td>
                                                                <td style={{textAlign : "center"}}>{moment(event.event_date).format("DD MMMM YYYY")}</td>
                                                                <td style={{textAlign : "center"}}>{event.event_status === "1" ?  "Aktif" : "Kedaluarsa"}</td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    <tr>
                                                        <td colSpan={8}></td>
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
                            <h4 className="modal-title">Rincian Event</h4>
                            <span onClick={this.closeModal} className="modal-close">&times;</span>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table font-sm table-bordered">
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>Informasi</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.hasOwnProperty("preview") ?
                                            
                                            <>
                                                <tr>
                                                    <td style={{width:150}}>Poster</td>
                                                    <td><img width={200} src={this.state.preview.event_poster.split("/")[0] === "assets" ? Setting.isOnline ? Setting.onlinePath + this.state.preview.event_poster : Setting.offlinePath + this.state.preview.event_poster : this.state.preview.event_poster } /></td>
                                                </tr>
                                                <tr>
                                                    <td>Nama Event</td>
                                                    <td>{this.state.preview.event_name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Code Event</td>
                                                    <td>{this.state.preview.event_code}</td>
                                                </tr>
                                                <tr>
                                                    <td>Status</td>
                                                    <td>{this.state.preview.event_status === "1" ? "Aktif" : "Kedaularsa"}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kategori</td>
                                                    <td>{this.state.preview.event_category}</td>
                                                </tr>
                                                <tr>
                                                    <td>Penyelenggara/EO</td>
                                                    <td>{this.state.preview.event_author}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kontak</td>
                                                    <td>{this.state.preview.event_contact}</td>
                                                </tr>
                                                <tr>
                                                    <td>Berbayar</td>
                                                    <td>{this.state.preview.event_paid === "free" ? "Gratis" : "Berbayar"}</td>
                                                </tr>
                                                <tr>
                                                    <td>Tanggal Event</td>
                                                    <td>{moment(this.state.preview.event_date).format("DD-MMMM-YYYY")}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kota</td>
                                                    <td>{this.state.preview.event_city}</td>
                                                </tr>
                                                <tr>
                                                    <td>Tempat</td>
                                                    <td>{this.state.preview.event_place}</td>
                                                </tr>
                                                <tr>
                                                    <td>Deskripsi Event</td>
                                                    <td>{this.state.preview.event_description}</td>
                                                </tr>
                                            </>
                                        :
                                            <tr>
                                                <td colSpan={2}>No data</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => this.handleEditButton(this.state.preview)} className="btn btn-primary">Edit</button>
                            <button onClick={() => this.deleteEvent(this.state.preview.event_id)} className="btn btn-danger ml-2">Hapus</button>
                            <button onClick={this.closeModal} className="btn btn-secondary ml-2">Kembali</button>
                        </div>
                    </Modal> 
                    :
                    null
                }
            </>
        )
    }
}



export default ContentWrapper(ContextConsumer(EventList))