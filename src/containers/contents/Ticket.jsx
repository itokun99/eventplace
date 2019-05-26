import React, {Component} from 'react';
import ContentWrapper from '../ContentWrapper';

class Ticket extends Component {
    constructor(props){
        super(props);
        this.state = {
            tickets : []
        }
    }
    
    render(){
        return(
            <div className="ticket-section">
                <div className="row">
                    <div className="col-12">
                        <div className="ticket-main">
                            <div className="ticket-top mb-2">
                                <button className="btn btn-primary">Filter</button>
                            </div>
                            <div className="ticket-body">
                                <div className="table-responsive">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Kode Tiket</th>
                                                <th>Nama</th>
                                                <th>Event</th>
                                                <th>EO</th>
                                                <th>Tipe</th>
                                                <th>Status</th>
                                                <th>Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContentWrapper(Ticket);