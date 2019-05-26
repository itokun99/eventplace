import React from 'react';

const UserTable = (props) => {
    return(
        <table className="table table-hover table-bordered font-sm">
            <thead className="">
                <tr>
                    <th style={{textAlign:"center"}}>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    {/* <th style={{textAlign:"center"}}>Point</th> */}
                    <th style={{textAlign:"center"}}>Created Date</th>
                    <th style={{textAlign:"center"}}>Status</th>
                </tr>
            </thead>
            <tbody>
                {props.data.length > 0 ?
                    props.data.map((value, index) => {
                        return(
                            <tr key={index}>
                                <td style={{textAlign:"center"}}>{index+1}</td>
                                <td>{value.user_name}</td>
                                <td>{value.user_email}</td>
                                {/* <td style={{textAlign:"center"}}>{value.user_point}</td> */}
                                <td style={{textAlign:"center"}}>{value.user_created_date}</td>
                                <td style={{textAlign:"center"}}>{value.user_status === "1" ? "active" : "not active" }</td>
                            </tr>
                        )
                    })
                :
                    <tr>
                        <td colSpan={6} style={{textAlign:'center'}}>Tidak ada data</td>
                    </tr>
                }
            </tbody>
        </table>
    )
}

export default UserTable;