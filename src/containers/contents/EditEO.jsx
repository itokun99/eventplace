import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import API, { Setting } from '../../services/Services';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

class EditEO  extends Component {
    state = {
        eventOrganizer : {
            eo_id : "",
            eo_name : "",
            eo_email : "",
            // eo_password : "",
        },
        imageFile : {
            file_data : "",
            file_source : "",
            file_extension : "",
        },
        sendFile : false,
    }

    handleClearImage = () => {
        this.setState({
            imageFile : {
                file_data : "",
                file_source : "",
            },
            sendFile : false
        })
    }

    handleTextChange = (input) => {
        let eventOrganizer = {...this.state.eventOrganizer};
        let name = input.target.name;
        let imageFile = {...this.state.imageFile};
        let inputFile = false;
        
        switch(name){
            case "eo_name":
                eventOrganizer.eo_name = input.target.value;
                break;

            case "eo_email":
                eventOrganizer.eo_email = input.target.value;
                break;
            
            case "eo_password":
                eventOrganizer.eo_password = input.target.value;
                break;

            case "eo_bio":
                eventOrganizer.eo_bio = input.target.value;
                break;
            
            case "file_data":
                let reader = new FileReader();
                let file_data = input.target.files[0];
                reader.onloadend = () => {
                    imageFile.file_source = reader.result;
                }
                if(file_data){
                    imageFile.file_extension = file_data.type;
                    imageFile.file_data = file_data;
                    reader.readAsDataURL(file_data);
                    inputFile = true  
                } else {
                    imageFile.file_extension = "";
                    imageFile.file_data = ""
                    imageFile.file_source = "";
                    inputFile = false;  
                }
                break;

            default:
                return false;
        }

        setTimeout(() => {
            this.setState({
                eventOrganizer : eventOrganizer,
                imageFile : imageFile,
                sendFile : imageFile.file_data !== "" ? true : false,
            }, () => {
                console.log(this.state.eventOrganizer)
                console.log(this.state.imageFile)
            })
        }, inputFile ? 100 : 0);
    }

    handleSubmit = () => {
        let state = {...this.state};
        let noValue = false;
        
        for(let key in state.eventOrganizer){
            if(state.eventOrganizer[key] === ""){
                noValue = true;
            }
        }

        if(noValue){
            alert("Lengkapi formulir dengan benar!");
        } else {
            let data = {
                ...state.eventOrganizer,
                send_file : state.sendFile,
                file_type : state.imageFile.file_extension
            }
            API.updateEventOrganizer(data)
            .then((result) => {
                if(result.status){
                    if(state.sendFile){
                        let data = result.data;
                        let formData = new FormData();
                        formData.append('file_name', data.image_name);
                        formData.append('eo_id', state.eventOrganizer.eo_id);
                        formData.append('file_data', state.imageFile.file_data);

                        API.uploadEoPic(formData)
                        .then((result) => {
                            if(result.status){
                                console.log(result);
                                alert("Berhasil Mengubah Informasi EO");
                                this.props.history.push(`${Setting.basePath}admin/event-organizer`);
                            } else {
                                console.log(result);
                                alert("Berhasil Mengubah Informasi EO");
                                this.props.history.push(`${Setting.basePath}admin/event-organizer`);
                            }
                        })
                    } else {
                        alert("Berhasil Mengubah Informasi EO");
                        this.props.history.push(`${Setting.basePath}admin/event-organizer`);
                    }
                } else {
                    console.log(result.message);
                    alert(result.message);
                }
            })
            
        }
    }

    getEoData = () => {
        let eventOrganizer = {...this.state.eventOrganizer}
        let imageFile = {...this.state.imageFile}

        let eo_id = this.props.match.params.eo_id;
        let eo_data = this.props.history.location.state;
        if(typeof(eo_data) !== "undefined"){
            let data = eo_data.data;
            eventOrganizer.eo_id = data.eo_id;
            eventOrganizer.eo_name = data.eo_name;
            eventOrganizer.eo_email = data.eo_email;
            eventOrganizer.eo_bio = data.eo_bio;
            imageFile.file_source = `${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath}${data.eo_pic}`;
            this.setState({
                eventOrganizer : eventOrganizer,
                imageFile : imageFile 
            })
        } else {
            API.getEventOrganizer({
                id : eo_id
            })
            .then((result) => {
                if(result.status){
                    let data = result.data[0];
                    eventOrganizer.eo_id = data.eo_id;
                    eventOrganizer.eo_name = data.eo_name;
                    eventOrganizer.eo_email = data.eo_email;
                    eventOrganizer.eo_bio = data.eo_bio;
                    imageFile.file_source = `${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath}${data.eo_pic}`;
                    this.setState({
                        eventOrganizer : eventOrganizer,
                        imageFile : imageFile
                    })
                } else {
                    console.log(result);
                    alert(result.message);
                }
            })
        }
    }

    componentDidMount(){
        this.getEoData();
    }

    render(){
        console.log(this);
        return(
            <div className="addeo-section">
                <div className="row">
                    <div className="col-12">
                        <div className="addeo-main card">
                            <div className="row">
                                <div className="col-12 col-sm-12">
                                    <h2 className="m-0 mb-4">Change EO Account</h2>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                    <div className="image-wrapper mb-3" style={{backgroundImage : `url('${this.state.imageFile.file_source}')`}}>
                                        <input onChange={(e) => this.handleTextChange(e)} type="file" className="image-input" name="file_data" accept=".jpg,.png,.jpeg,.JPEG,.PNG" />
                                        <span className="image-title">Upload Image</span>
                                    </div>

                                    <div style={{textAlign : "center"}}>
                                        <button onClick={this.handleClearImage} className="btn btn-danger btn-sm">Clear image</button>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Name</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input defaultValue={this.state.eventOrganizer.eo_name} onChange={(e) => this.handleTextChange(e)} type="text" className="form-control" placeholder="Name of Event Organizer" name="eo_name" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Email</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input defaultValue={this.state.eventOrganizer.eo_email} onChange={(e) => this.handleTextChange(e)} type="text" className="form-control" placeholder="eventorganizer@mail.com" name="eo_email" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Bio</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <textarea onChange={(e) => this.handleTextChange(e)} rows={10} className="form-control" name="eo_bio" placeholder="Bio of event organizer" value={this.state.eventOrganizer.eo_bio}></textarea>
                                        </div>
                                    </div>
                                    
                                    {/* <div className="form-group row">
                                        <label className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label">Verify Password</label>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <input onChange={(e) => this.handleTextChange(e)} type="password" className="form-control" placeholder="******" name="eo_password" />
                                            {this.state.passwordNotMatch ? <div className="invalid-feedback">password not match</div> : ""}
                                        </div>
                                    </div> */}
                                    <div className="form-group row">
                                        <div className='col-12 col-sm-12 col-md-3 col-lg-3'></div>
                                        <div className="col-12 col-sm-12 col-md-9 col-lg-9">
                                            <button onClick={this.handleSubmit} className="btn btn-primary mr-2">Submit</button>
                                            <Link to={`${Setting.basePath}admin/event-organizer/`} className="btn btn-secondary">Cancel</Link>
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

export default ContentWrapper(EditEO);