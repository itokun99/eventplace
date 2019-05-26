import React from 'react';

const Alert = (props) => {
    return(
        <div className={`alert alert-${props.type}`} style={props.style}>
            <span>{props.message}</span>
        </div>
    )
}

export default Alert;