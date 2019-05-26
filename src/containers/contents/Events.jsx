import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';
import EventTable from '../../components/EventTable';
import API, { Setting } from '../../services/Services';
import Modal from '../../components/Modal';
import { ContextConsumer } from '../../context/Context';

class Events extends Component {
    state = {
        events : [],
        city: [],
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
        imageByUrl : false,
        modeAdd : false,
        modeEdit : false,
        imageEdit : false,
        imageData : {
            image_file : "",
            image_source : "" 
        },
        showModal : false,
        
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
        }, () => {
            this.setState({
                modeAdd : false,
            }, () => {
                this.setState({
                    modeAdd : true,
                })
            })
        })
    }
    
    switchMode = () => {
        this.setState({
            modeAdd : !this.state.modeAdd,
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


    eventGet = () => {
        let loginData = this.props.ContextState.loginData;
        let appkey = loginData.appkey;
        let params = {
            appkey : appkey
        }
        API.eventsGet(params).then((result) => {
            if(result.status){
                this.setState({
                    events : result.data
                })
            } else {
                console.log(result)
                if(result.code === 404){
                    this.setState({
                        events : []
                    })
                } 
            }
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
            alert("Please fill the form correctly");
        } else {
            API.eventPost(event)
            .then((result) => {
                if(result.status){
                    if(image.image_file !== ""){
                        let image_name = result.data
                        let formData = new FormData();
                        formData.append('image_name', image_name);
                        formData.append('image_file', image.image_file);
                        API.eventUploadPoster(formData)
                        .then((result) => {
                            console.log(result)
                            if(result.status){
                                alert("Event Berhasil ditambahkan!");
                                this.switchMode()
                                // this.resetForm();
                                this.eventGet();
                            } else {
                                alert("Event Berhasil ditambahkan namun posternya gagal di upload!");
                                this.switchMode();
                                // this.resetForm();
                                this.eventGet();
                            }
                        })
                    } else {
                        alert("Event Berhasil ditambahkan!");
                        this.switchMode()
                        // this.resetForm();
                        this.eventGet();
                    }
                } else {
                    alert(result.message);
                }
            })
        }
    }

    editEvent = () => {
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
            alert("Please fill the form correctly");
        } else {
            API.eventPut(event)
            .then((result) => {
                if(result.status){
                    if(image.image_file !== ""){
                        let image_name = result.data
                        let formData = new FormData();
                        formData.append('image_name', image_name);
                        formData.append('image_file', image.image_file);
                        API.eventUploadPoster(formData)
                        .then((result) => {
                            console.log(result)
                            if(result.status){
                                alert("Event berhasil di edit");
                                this.switchMode()
                                this.eventGet();
                            } else {
                                alert("Event Berhasil diedit namun posternya gagal di upload!");
                                this.switchMode()
                                this.eventGet();
                            }
                        })
                    } else {
                        alert("Event Berhasil diedit");
                        this.switchMode()
                        this.eventGet();
                    }
                } else {
                    alert(result.message);
                }
            })
        }
    }

    handleEditButton = (event) => {
        var poster = event.event_poster;
        var imageByUrl = false;
        poster = poster.split("/");
        if(poster[0] !== "assets"){
            imageByUrl = true
        }
        this.setState({
            event : event,
            modeEdit : true,
            modeAdd : true,
            showModal : false,
            imageByUrl : imageByUrl,
            imageData : {
                image_file : "",
                image_source : `${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath}${event.event_poster}`
            }
        })
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
            case "event_date":
                event.event_date = input.target.value;
                break;
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

    previewEvent = (event) => {
        this.setState({
            showModal : true,
            preview : event,
        })
    }

    closePreview = () => {
        this.setState({
            showModal : false,
            preview : {}
        })
    }

    deleteEvent = (event_id) => {
        let conf = window.confirm("Want to delete this Event");
        if(conf){
            API.eventDelete(event_id)
            .then((response) => {
                if(response.status){
                    this.setState({
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
                        showModal : false,
                    },() => {
                        this.eventGet();
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

    componentDidMount(){
        document.getElementById('panel-title').innerText = "Event List";
        this.eventGet();
        this.cityGet();
    }

    
    render(){
        return(
            <>
                <div className="offer-section">
                    <div className="row">
                        <div className="col-12">
                            <div className="offer-main card">
                                
                                <div className="offer-header pb-3">
                                    <button onClick={this.switchMode} className="btn btn-primary">{this.state.modeAdd ? "Event List" : "Add Event" }</button>
                                </div>

                                <div className="offer-body">
                                    {
                                        this.state.modeAdd ?
                                            <div className="add-form row justify-content-center">
                                                <div className="col-12 col-sm-12 col-md-8 col-lg-6">
                                                    <div className="form-group">
                                                        <label>Event Name</label>
                                                        <input onChange={(e) => this.handleInputChange(e)} defaultValue={this.state.event.event_name} type="text" className="form-control" name="event_name" placeholder="Event Name" />
                                                    </div>
                                                    {
                                                        this.state.modeEdit ? 
                                                        "" : 
                                                        <div className="form-group">
                                                            <label>Event Code</label>
                                                            <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" defaultValue={this.state.event.event_code} name="event_code" placeholder="xxxxx" />
                                                        </div>
                                                    }
                                                    <div className="form-group">
                                                        <label>Category</label>
                                                        <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" name="event_category" defaultValue={this.state.event.event_category} placeholder="Music, Entertainment, etc.." />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Paid Status</label>
                                                        <select name="event_paid" value={this.state.event.event_paid} onChange={(e) => this.handleInputChange(e)} className="form-control">
                                                            <option value="">- choose status -</option>
                                                            <option value="free">free</option>
                                                            <option value="paid">paid</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Event Author</label>
                                                        <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" name="event_author" placeholder="Author / IO" defaultValue={this.state.event.event_author} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Contact Person</label>
                                                        <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" name="event_contact" placeholder="Phone Number" defaultValue={this.state.event.event_contact} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>City</label>
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
                                                    <div className="form-group">
                                                        <label>Place</label>
                                                        <input onChange={(e) => this.handleInputChange(e)} type="text" className="form-control" name="event_place" placeholder="Type event place" defaultValue={this.state.event.event_place} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Event Date</label>
                                                        <input onChange={(e) => this.handleInputChange(e)} type="date" className="form-control" min="2019-01-01" max="2100-01-01" name="event_date" placeholder="Date" defaultValue={this.state.event.event_date} />
                                                    </div>
                                                    
                                                    <div className="form-group">
                                                        <label>Description</label>
                                                        <textarea onChange={(e) => this.handleInputChange(e)} className="form-control" rows={5} name="event_description" placeholder="Describe the Event" value={this.state.event.event_description}></textarea>
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
                                                    <div className="form-group">
                                                        {
                                                            this.state.modeEdit ? <button onClick={this.editEvent} className="btn btn-primary">Edit Event</button> : <button onClick={this.saveEvent} className="btn btn-primary">Submit</button>
                                                        }
                                                        &nbsp;&nbsp;&nbsp;
                                                        <button onClick={this.resetForm} className="btn btn-secondary">Reset</button>
                                                    </div>
                                                </div>
                                            </div>
                                        :
                                            <div className="table-responsive">
                                                <EventTable preview={(event) => this.previewEvent(event)} data={this.state.events} />
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showModal ? 
                        <Modal size="medium">
                            <div className="modal-header">
                                <h5 className="modal-title">Preview Event</h5>
                                <span onClick={this.closePreview} className="modal-close">&times;</span>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive">
                                    <table className="table font-sm table-bordered">
                                        <thead>
                                            <tr>
                                                <th colSpan={2}>Information</th> 
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
                                                        <td>Event Name</td>
                                                        <td>{this.state.preview.event_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Event Code</td>
                                                        <td>{this.state.preview.event_code}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Status</td>
                                                        <td>{this.state.preview.event_status === "1" ? "Active" : "Expired"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Event Category</td>
                                                        <td>{this.state.preview.event_category}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Event Author</td>
                                                        <td>{this.state.preview.event_author}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Contact Person</td>
                                                        <td>{this.state.preview.event_contact}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Paid Status</td>
                                                        <td>{this.state.preview.event_paid}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Date</td>
                                                        <td>{this.state.preview.event_date}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>City</td>
                                                        <td>{this.state.preview.event_city}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Place</td>
                                                        <td>{this.state.preview.event_place}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Description</td>
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
                                <button onClick={() => this.handleEditButton(this.state.preview)} className="btn btn-primary">Edit</button>&nbsp;&nbsp;
                                <button onClick={() => this.deleteEvent(this.state.preview.event_id)} className="btn btn-danger">Delete</button>&nbsp;&nbsp;
                                <button onClick={this.closePreview} className="btn btn-secondary">Close</button>
                            </div>
                        </Modal>
                    : ""
                }
            </>
        )
    }
}


export default ContentWrapper(ContextConsumer(Events));