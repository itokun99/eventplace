import React, { Component } from 'react';
import { ContextConsumer } from '../../context/Context';
import ContentWrapper from '../ContentWrapper';
import API, {Setting} from '../../services/Services';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import {Link} from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";

class EventAdd extends Component {
    constructor(props){
        super(props);
        this.state = {
            city: [],
            event: {
                event_name : "",
                event_code : "",
                event_category : "",
                event_author : "",
                event_contact : "",
                event_city : "",
                event_place : "",
                event_date : moment().format('YYYY-MM-DD'),
                event_description : "",
                event_paid : "",
                event_author_id : "",
                event_poster : "",
            },
            imageByUrl : false,
            imageEdit : false,
            imageData : {
                image_file : "",
                image_source : "" 
            }
        }
    }
    resetForm = () => {
        this.setState({
            modeEdit : false,
            imageByUrl : false,
            event: {
                event_name : "",
                event_code : "",
                event_category : "",
                event_author : "",
                event_contact : "",
                event_city : "",
                event_place : "",
                event_date : "",
                event_description : "",
                event_paid : "",
                event_author_id : "",
                event_poster : "",
            },
            imageData : {
                image_file : "",
                image_source : "" 
            }
        })
    }

    switchImage = () => {
        let event = {...this.state.event}
        event.event_poster = "";
        this.setState({
            imageByUrl : !this.state.imageByUrl,
            imageData : {
                image_file : "",
                image_source : ""
            },
            event : event,
            showModal : false,
        })
    }

    cityGet = () => {
        let loginData = this.props.ContextState.loginData;
        let appkey = loginData.appkey;
        let params = {
            appkey : appkey
        }
        API.cityGet(params)
        .then((result) => {
            if(result.status){
                this.setState({
                    city : result.data
                })
            } else {
                console.log(result)
            }

        })
    }

    saveEvent = () => {
        let event = {...this.state.event};
        let image = {...this.state.imageData};
        if(image.image_file !== ""){
            event.image_file_name = image.image_file.name
            event.image_file_type = image.image_file.type
        }
        let noValue = false;
        for(let key in event){
            if(event[key] === "" && key !== "event_poster"){
                noValue = true
            }
        }
        if(noValue){
            alert("Isi filenya dengan benar!");
        } else {
            let loginData = this.props.ContextState.loginData
            event.appkey = loginData.appkey
            API.eventPost(event)
            .then((result) => {
                if(result.status){
                    if(image.image_file !== ""){
                        let image_name = result.data
                        let formData = new FormData();
                        formData.append('appkey', loginData.appkey );
                        formData.append('image_name', image_name);
                        formData.append('image_file', image.image_file);
                        API.eventUploadPoster(formData)
                        .then((result) => {
                            console.log(result)
                            if(result.status){
                                alert("Event Berhasil ditambahkan!");
                                this.props.history.push(`${Setting.basePath}event`)
                            } else {
                                alert("Event Berhasil ditambahkan namun posternya gagal di upload!");
                                this.props.history.push(`${Setting.basePath}event`)
                            }
                        })
                    } else {
                        alert("Event Berhasil ditambahkan!");
                        this.props.history.push(`${Setting.basePath}event`)
                    }
                } else {
                    alert(result.message);
                }
            })
        }
    }

    handleInputChange = (input) => {
        let name = input.target.name;
        let event = {...this.state.event};
        let image = {...this.state.imageData}
        let isLoading = false;
        let imageEdit = false;
        switch(name){
            case "event_name":
                event.event_name  = input.target.value;
                break;
            case "event_code":
                event.event_code  = input.target.value;
                break;
            case "event_author":
                event.event_author  = input.target.value;
                break;
            case "event_contact":
                event.event_contact  = input.target.value;
                break;
            case "event_paid":
                event.event_paid  = input.target.value;
                break;
            case "event_city":
                event.event_city  = input.target.value;
                break;
            case "event_place":
                event.event_place  = input.target.value;
                break;
            case "event_category":
                event.event_category = input.target.value;
                break;
            case "event_description":
                event.event_description = input.target.value;
                break;
            // case "event_date":
            //     event.event_date = input.target.value;
            //     break;
            case "event_poster":
                event.event_poster = input.target.value;
                break;
            case "image_file":
                image.image_file = input.target.files[0];
                let reader = new FileReader();
                reader.onloadend = () => {
                    image.image_source = reader.result;
                }
                if(image.image_file){
                    reader.readAsDataURL(image.image_file);
                    isLoading = true;
                    imageEdit = true;
                } else {
                    isLoading = false;
                    imageEdit = false;
                }
                break;
            default:
                return false;
        }

        let admin_data = JSON.parse(window.localStorage.loginData);
        if(admin_data.user_type === "1"){
            event.event_author_id = 0;  
        }

        setTimeout(() => {
            this.setState({
                event : event,
                imageData : image,
                imageEdit : imageEdit
            }, () => {
                console.log(this.state.imageData);
                console.log(this.state.event);
            })
        }, isLoading ? 100 : 0);
    }

    handleChangeDate = (date) => {
        let event = {...this.state.event};
        event.event_date = moment(date).format("YYYY-MM-DD");
        this.setState({
            event : event
        }, () => {
            console.log(this.state.event.event_date)
        })
    }

    
    componentDidMount(){
        document.getElementById('panel-title').innerText = "List Event";
        document.title = "List Event"
        this.cityGet();
    }

    render(){
        return(
            <div className="eventAdd">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="add-form row justify-content-center">
                                <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <h2>Tambah Event</h2>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Nama Event</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleInputChange(e)} defaultValue={this.state.event.event_name} type="text" className="form-control" name="event_name" placeholder="Event Name" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Kode Event</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" defaultValue={this.state.event.event_code} name="event_code" placeholder="xxxxx" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label" >Kategori</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" name="event_category" defaultValue={this.state.event.event_category} placeholder="Music, Entertainment, etc.." />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Berbayar/Gratis?</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <select name="event_paid" value={this.state.event.event_paid} onChange={(e) => this.handleInputChange(e)} className="form-control">
                                                <option value="">- choose status -</option>
                                                <option value="free">Berbayar</option>
                                                <option value="paid">Gratis</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Penyelenggara/EO</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" name="event_author" placeholder="Author / IO" defaultValue={this.state.event.event_author} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Kontak/WA</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" name="event_contact" placeholder="Phone Number" defaultValue={this.state.event.event_contact} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Kota</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <select onChange={(e) => this.handleInputChange(e)} value={this.state.event.event_city} name="event_city" className="form-control custom-control">
                                                {
                                                    this.state.city.length > 0 ?
                                                        <>
                                                            <option value="">- choose the city -</option>
                                                            { this.state.city.map((value, index) => {
                                                                return <option key={value.city_id} value={value.city_name}>{value.city_name}</option>
                                                            }) }
                                                        </>
                                                    :
                                                        <option>- no data -</option>
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Tempat Event</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" name="event_place" placeholder="Type event place" defaultValue={this.state.event.event_place} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Tanggal Event</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <DatePicker
                                                className = "form-control"
                                                selected = {moment(this.state.event.event_date).toDate()}
                                                onChange = {(e) => this.handleChangeDate(e)}
                                                dateFormat = "dd MMMM yyyy"
                                                withPortal
                                            />
                                            {/* <input onChange={(e) => this.handleInputChange(e)} type="date" className="form-control" min="2019-01-01" max="2100-01-01" name="event_date" placeholder="Date" defaultValue={this.state.event.event_date} /> */}
                                        </div>
                                    </div>
                                    
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Description</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <textarea onChange={(e) => this.handleInputChange(e)} className="form-control" rows={5} name="event_description" placeholder="Describe the Event" value={this.state.event.event_description}></textarea>
                                        </div>
                                    </div>
                                    <div className="form-group d-flex">
                                        {
                                            this.state.imageByUrl ?
                                            <div style={{width:"100%"}}>
                                                <button onClick={this.switchImage} className="btn btn-primary mb-2">From Computer</button>
                                                <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" style={{width: "100%"}} name="event_poster" placeholder="https://yourimageurl.com/image.png" defaultValue={this.state.event.event_poster}  />
                                            </div>
                                            : 
                                            <>
                                                <div className="poster-wrap mr-2" style={{backgroundImage : `url(${this.state.imageData.image_source})`}}>
                                                    <span>Upload Foto</span>
                                                    <input onChange={(e) => this.handleInputChange(e)} type="file" className="poster-input" name="image_file" accept=".jpg,.png,.jpeg" />
                                                </div>
                                                <div style={{display:"inline-block"}}>
                                                    <button onClick={this.switchImage} className="btn btn-primary">Image Url</button>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3"></div>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <button onClick={this.saveEvent} className="btn btn-primary">Simpan</button>
                                            <Link to={`${Setting.basePath}event`} className="btn btn-secondary ml-2">Kembali</Link>
                                        </div>
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

export default ContentWrapper(ContextConsumer(EventAdd));