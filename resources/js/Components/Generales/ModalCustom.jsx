import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalCustom = ({
    id,
    title,
    children,
    isOpen,
    onClose,
    btnfooter,
    tamaño,
    btnheader,
}) => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setShowModal(false);
        if (onClose) onClose();
    };

    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            dialogClassName="modal-90w"
            size={tamaño}
        >
            <Modal.Header>
                <Modal.Title>{title} </Modal.Title>
                <span className="float-end">{btnheader}</span>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <button className="btn btn-warning" onClick={handleClose}>
                    <samp className="fas fa-times"></samp> Cerrar
                </button>
                {btnfooter && <span>{btnfooter}</span>}
            </Modal.Footer>
        </Modal>
    );
};

export default ModalCustom;
