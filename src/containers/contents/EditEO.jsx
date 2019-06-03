import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API, { Setting } from '../../services/Services';
import { Link } from 'react-router-dom'
import { ContextConsumer } from '../../context/Context';

class AddEO  extends Component {
    constructor(props){
        super(props);
        this.state = {
            eventOrganizer : {
                user_id : "",
                user_name : "",
                user_email : "",
                user_phone : "",
                eo_id : "",
                eo_name : "",
                eo_bio : "",
            },
            matchPassword : true,
        }
        this.handleChangeText = this.handleChangeText.bind(this);
    }

    handleChangeText = (input) => {
        let eo = {...this.state.eventOrganizer};
        let matchPassword = true;
        let name = input.target.name;
        let value = input.target.value;
        switch(name){
            case "user_name":
                eo.user_name = value;
                break;
            case "user_email":
                eo.user_email = value;
                break;
            case "user_phone":
                eo.user_phone = value;
                break;
            case "eo_name":
                eo.eo_name = value;
                break;
            case "eo_bio":
                eo.eo_bio = value;
                break;
            default:
                return false;
        }

        this.setState({
            eventOrganizer : eo
        })
    }

    submitForm = () => {
        let eo = {...this.state.eventOrganizer};
        let novalue = false;
        
        for(let key in eo){
            if(eo[key] === ""){
                novalue = true;
            }
        }

        if(novalue){
            alert('Isi form dengan benar!');
        } else {
            let loginData = this.props.ContextState.loginData;
            eo.appkey = loginData.appkey;
            API.updateEventOrganizer(eo)
            .then((result) => {
                if(result.status){
                    alert(result.message);
                    this.props.history.push(`${Setting.basePath}event-organizer`);
                } else {
                    console.log(result)
                    alert(result.message);
                }
            })
        }
    }

    getEOData = () => {
        let loginData = this.props.ContextState.loginData;
        let eo = this.props.history.location.state;
        if(typeof(eo) !== "undefined"){
            let user_data = {...eo.user_data, ...eo.user_data.eo_data }
            delete user_data.eo_data;
            this.setState({
                eventOrganizer : user_data
            })
        } else {
            let user_id = this.props.match.params.user_id;
            let params = {
                appkey : loginData.appkey,
                user_id : user_id
            }
            API.getEventOrganizer(params)
            .then((result) => {
                if(result.status){
                    let user_data = {...result.data[0], ...result.data[0].eo_data } ;
                    delete user_data.eo_data;
                    this.setState({
                        eventOrganizer : user_data
                    })
                } else {
                    console.log(result);
                    this.props.history.push(`${Setting.basePath}event-organizer`);
                }
            })
        }
    }

    componentDidMount(){
        document.getElementById('panel-title').innerText = "Edit Event Organizer";
        document.title = "Edit Event Organizer";
        this.getEOData();
    }

    render(){
        console.log(this)
        return(
            <div className="addeo-section">
                <div className="row">
                    <div className="col-12">
                        <div className="addeo-main card">
                            <div className="row justify-content-center">
                                <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                                    <h2 className="m-0 mb-4">Event Organizer</h2>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Nama Pengguna</label>
                                        <div className="col-12 co-sm-12 col-md-9 col-lg-9">
                                            <input defaultValue={this.state.eventOrganizer.user_name} onChange={this.handleChangeText} type="text" name="user_name" className="form-control" placeholder="Nama Pemegang Akun EO" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Email</label>
                                        <div className="col-12 co-sm-12 col-md-9 col-lg-9">
                                            <input defaultValue={this.state.eventOrganizer.user_email} onChange={this.handleChangeText} type="email" name="user_email" className="form-control" placeholder="example@mail.com" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Telepon</label>
                                        <div className="col-12 co-sm-12 col-md-9 col-lg-9">
                                            <input defaultValue={this.state.eventOrganizer.user_phone} onChange={this.handleChangeText} type="text" name="user_phone" className="form-control" placeholder="+628xxxxxxx" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Nama EO</label>
                                        <div className="col-12 co-sm-12 col-md-9 col-lg-9">
                                            <input defaultValue={this.state.eventOrganizer.eo_name} onChange={this.handleChangeText} type="text" name="eo_name" className="form-control" placeholder="Nama Event Organizer" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Bio/Deskripsi EO</label>
                                        <div className="col-12 co-sm-12 col-md-9 col-lg-9">
                                            <textarea value={this.state.eventOrganizer.eo_bio} onChange={this.handleChangeText} name="eo_bio" className="form-control" rows={10} placeholder="Deskripsi Singkat Event Organizer" />
                                        </div>
                                    </div>
                                    {/* <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Password</label>
                                        <div className="col-12 co-sm-12 col-md-9 col-lg-9">
                                            <input onChange={this.handleChangeText} type="password" name="user_password" className={`form-control ${this.state.matchPassword === false ? "is-invalid" : ""}`} placeholder="*******" />
                                            {this.state.matchPassword === false ? <div className="invalid-feedback active">Not match</div>: null}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label"></label>
                                        <div className="col-12 co-sm-12 col-md-9 col-lg-9">
                                            <input onChange={this.handleChangeText} type="password" name="user_verify_password" className={`form-control ${this.state.matchPassword === false ? "is-invalid" : ""}`} placeholder="*******" />
                                            {this.state.matchPassword === false ? <div className="invalid-feedback active">Not match</div>: null}
                                        </div>
                                    </div> */}
                                    <div className="form-group">
                                        <button onClick={this.submitForm} className="btn btn-primary">Submit</button>
                                        <Link to={`${Setting.basePath}event-organizer`} className="btn btn-primary ml-2">Kembali</Link>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContentWrapper(ContextConsumer(AddEO));