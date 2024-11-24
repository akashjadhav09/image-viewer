import { MdClose } from "react-icons/md";

import './popup.css'

function ImagePopUpModal({isOpen, onClose, title, imagePath}) {

    if (!isOpen) return null;

    return (
        <div className="popup-wrapper-outer">            
            <div className='popup-wrapper-inner' onClick={(e) => e.stopPropagation()}>
                <div className="close-button-wrapper-outer">
                    <div className="image-preview">Image Preview</div>
                    <div className="close-button-wrapper-inner">
                        <MdClose className="close-button" onClick={onClose} />                        
                    </div>
                </div>
                <div className='image-name-container'>
                    <input type="text" className="image-alt-text" value={title || "Default Image"} readOnly/>
                </div>
                <div className='image-container'>
                    <img src={imagePath}/>
                </div>
            </div>
        </div>
    );
}

export default ImagePopUpModal;
