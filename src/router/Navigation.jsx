import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ContextProvider, { ContextConsumer } from '../context/Context';
import Dashboard from '../containers/contents/Dashboard';
import Login from '../containers/contents/Login';
import Users from '../containers/contents/Users';
import EventOrganizer from '../containers/contents/EO';
import { Setting } from '../services/Services';
import AddEO from '../containers/contents/AddEO';
import EditEO from '../containers/contents/EditEO';
import EventList from '../containers/contents/EventList';
import EventAdd from '../containers/contents/EventAdd';
import EventEdit from '../containers/contents/EventEdit';


const RouterWrapper = (Navigation) => {
    return(
        class Router extends Component {
            render(){
                return(
                    <BrowserRouter>
                        <Navigation {...this.props} />
                    </BrowserRouter>
                )
            }
        }
    )
}


const Navigation = (props) => {
    return(
        <Switch>
            {
                props.ContextState.isLogin ? 
                    <>  
                        <Route path =  {`${Setting.basePath}`} component={Dashboard} exact />
                        <Route path =  {`${Setting.basePath}user`} component={Users}  /> 
                        <Route path =  {`${Setting.basePath}event`} exact component={EventList}  />
                        <Route path =  {`${Setting.basePath}event/add`} component={EventAdd}  />
                        <Route path =  {`${Setting.basePath}event/edit/:event_id`} component={EventEdit}  />
                        <Route path =  {`${Setting.basePath}event-organizer`} exact component={EventOrganizer}  />
                        <Route path =  {`${Setting.basePath}event-organizer/add`} component={AddEO}  />
                        <Route path =  {`${Setting.basePath}event-organizer/edit/:user_id`} component={EditEO}  />
                    </>
                :
                    <>
                        <Route path =  {`${Setting.basePath}`} component={Login} exact /> 
                    </>
            }
        </Switch>
    )
}


export default
ContextProvider(
    RouterWrapper(
        ContextConsumer(
            Navigation
        )
    )
);