import React from 'react';

const EventTable = (props) => {
    return(
        <table className="table table-hover table-bordered font-sm">
            <thead className="">
                <tr>
                    <th style={{minWidth: 50,textAlign:"center"}}>#</th>
                    <th style={{minWidth: 250}}>Event Name</th>
                    <th style={{minWidth: 150, textAlign : "center"}}>Category</th>
                    <th style={{minWidth: 150, textAlign: "center"}}>Author</th>
                    <th style={{minWidth: 200,textAlign:"center"}}>City</th>
                    <th style={{minWidth: 300,textAlign:"center"}}>Place</th>
                    <th style={{minWidth: 150,textAlign:"center"}}>Paid Status</th>
                    <th style={{minWidth: 150,textAlign:"center"}}>Event Date</th>
                    <th style={{minWidth: 100,textAlign:"center"}}>Status</th>
                </tr>
            </thead>
            <tbody>
                {props.data.length > 0 ?
                    props.data.map((value, index) => {
                        return(
                            <tr key={index}>
                                <td style={{textAlign:"center"}}>{index+1}</td>
                                <td onClick={() => props.preview(value)} style={{cursor : "pointer"}}>{value.event_name}</td>
                                <td style={{textAlign: "center"}}>{value.event_category}</td>
                                <td style={{textAlign: "center"}}>{value.event_author}</td>
                                <td style={{textAlign:"center"}}>{value.event_city}</td>
                                <td style={{textAlign:"center"}}>{value.event_place}</td>
                                <td style={{textAlign:"center"}}>{value.event_paid}</td>
                                <td style={{textAlign:"center"}}>{value.event_date}</td>
                                <td style={{textAlign:"center"}}>{value.event_status === "1" ? "active" : "expired" }</td>
                            </tr>
                        )
                    })
                :
                    <tr>
                        <td colSpan={9} style={{textAlign:'center'}}>Tidak ada data</td>
                    </tr>
                }
            </tbody>
        </table>
    )
}

export default EventTable;