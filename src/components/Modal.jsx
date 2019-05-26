import React from 'react';

const Modal = (props) => {
    return(
        <div className="modal">
            <div className={`modal-dialog modal-${props.size}`}>
                <div className="modal-content">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Modal;