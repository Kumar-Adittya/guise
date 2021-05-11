
import React, { useState } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { animate } from '../images/index'
const ModalLoader = (props) => {
    const {
        buttonLabel,
        className
    } = props;
    const [modal, setModal] = useState(props.isShow);
    const [backdrop, setBackdrop] = useState('static');
    const [keyboard, setKeyboard] = useState(false);

    const toggle = () => setModal(!modal);



    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} backdrop={backdrop} keyboard={keyboard}>

                <ModalBody>
                    <div className="text-center">
                        <img src={animate} alt="" />
                    </div>
                    <p className="modal_body_para">Please wait your images are getting registered</p>
                    <div className="btn_wrap">
                        <Button color="secondary" className="btn_loading" onClick={toggle}>...Loading</Button>
                    </div>
                </ModalBody>

            </Modal>
        </div>
    );
}

export default ModalLoader;