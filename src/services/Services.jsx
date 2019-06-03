export const Setting = {
    isOnline : false,
    onlinePath : '',
    offlinePath : 'http://192.168.100.5/io/',
    basePath : '/',
    firstKey : 999999999
}

const request = (url, method, data, formData = false) => {
    const promise = new Promise((resolve, reject) => {
        let option = {};
        if(method === "POST" || method === "post" || method === "put" || method === "PUT"){
            option.method = method;
            option.body = JSON.stringify(data);
        } else {
            option.method = method;
        }

        if(formData){
            option.body = data;
        } else {
            option.headers = {
                "Content-Type" : "application/json"
            }
        }

        fetch(`${Setting.isOnline ? Setting.onlinePath : Setting.offlinePath }${url}`,option)
        .then((response) => {
            if(response.ok){
                resolve(response.json())
            } else {
               resolve(response.json()); 
            }
        }).catch((error) => {
            console.log("error is", error);
            resolve(error.json())
        })
    })

    return promise;
}

const adminLogin = (data = {}) => {
    let path = 'api/admin/login'
    let method = "POST";
    return request(path, method, data);
}

const adminLogout = (data = {}) => {
    let path = 'api/admin/logout'
    let method = "POST";
    return request(path, method, data);
}

const eventsGet = (data = {}) => {
    let params = 0;
    for(let key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey  : ""}`;
    let event_id = `${typeof(data.id) !== "undefined" ? params > 1 ? "&id="+data.id : "id="+data.id : "" }`;
    let path = `api/events${params > 0 ? "?" : ""}${appkey}${event_id}`;
    return request(path);
}

const eventPost = (data = {}) => {
    let path = 'api/events';
    let method = "POST";
    return request(path, method, data);
}
const eventPut = (data = {}) => {
    let path = 'api/events';
    let method = "PUT";
    return request(path, method, data);
}
const eventUploadPoster = (data = new FormData()) => {
    let path = 'api/events/uploadposter';
    let method = "POST";
    return request(path, method, data, true);
}
const eventDelete = (data = {}) => {
    let path = `api/events/delete`;
    let method = "POST";
    return request(path, method, data);
}
const cityGet = (data = {}) => {
    let params = 0;
    for(let key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey  : ""}`;
    let path = `api/city${params > 0 ? "?" : ""}${appkey}`;
    return request(path);
}

const userGet = (data = {}) => {
    let params = 0;
    for(let key in data){
        params++
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey  : ""}`;
    let path = `api/users${params > 0 ? "?" : ""}${appkey}`;
    
    return request(path);
}

const getEventOrganizer = (data = {}) => {
    let params = 0;
    for(let key in data){
        params++;
    }
    let appkey = `${typeof(data.appkey) !== "undefined" ? params > 1 ? "&appkey="+data.appkey : "appkey="+data.appkey : ""}`;
    let user_id = `${typeof(data.user_id) !== "undefined" ? params > 1 ? "&user_id="+data.user_id : "user_id="+data.user_id : ""}`;
    let path = `api/users/event_organizer${params > 0 ? "?" : ""}${appkey}${user_id}`;
    
    return request(path);
}

const deleteUser = (data = {}) => {
    let path = 'api/users/deleteuser';
    let method = "POST";
    return request(path, method, data);
}


const createEventOrganizer = (data = {}) => {
    let path = "api/users/event_organizer";
    let method = "POST";
    return request(path, method, data);
}

const updateEventOrganizer = (data = {}) => {
    let path = "api/users/event_organizer";
    let method = "PUT";
    return request(path, method, data);
}

const deleteEventOrganizer = (data = {}) => {
    let path = `api/events/organizer`;
    let method = "DELETE";
    return request(path, method, data);
}

const uploadEoPic = (data = {}) => {
    let path = 'api/events/uploadeoposter';
    let method = "POST";
    return request(path, method, data, true);
}

const API  = {
    adminLogin,
    adminLogout,
    eventsGet,
    eventPost,
    eventUploadPoster,
    eventPut,
    eventDelete,
    cityGet,
    userGet,
    getEventOrganizer,
    createEventOrganizer,
    updateEventOrganizer,
    deleteEventOrganizer,
    uploadEoPic,
    deleteUser,
}

export default API;