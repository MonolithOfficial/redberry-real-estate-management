import { useEffect, useRef } from "react";

const DeleteModal = ({ isOpen, handleDelete, handleModalClose }) => {
    const deleteModalRef = useRef(null);

    const handleClickOutsideDeleteModal = (event) => {
        if (deleteModalRef.current && !deleteModalRef.current.contains(event.target)) {
            handleModalClose();
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideDeleteModal);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDeleteModal);
        };
    }, []);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal-content" ref={deleteModalRef}>
                <div className="cancel-x-button-holder">
                    <svg onClick={() => { handleModalClose() }} width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.5011 23.4999L29.0401 29.0389M17.9622 29.0389L23.5011 23.4999L17.9622 29.0389ZM29.0401 17.9609L23.5011 23.4999L29.0401 17.9609ZM23.5011 23.4999L17.9622 17.9609L23.5011 23.4999Z" stroke="#2D3648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <h2>გსურთ წაშალოთ ლისტინგი?</h2>
                <div className="modal-buttons">
                    <button className="cancel-button" onClick={handleModalClose}>გაუქმება</button>
                    <button className="delete-button" onClick={handleDelete}>დადასტურება</button>
                </div>
            </div>
        </div>
    )
};

export default DeleteModal;