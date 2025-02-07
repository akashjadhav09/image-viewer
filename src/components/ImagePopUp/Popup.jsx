import { MdClose } from "react-icons/md";

import './popup.css'

function ImagePopUpModal({isOpen, onClose, title, imagePath, imageSize, imageExtension, isDark}) {
    if (!isOpen) return null;

    return (
        <div className="popup-wrapper-outer">          
            <div className="popup-wrapper-inner" onClick={(e) => e.stopPropagation()} style={isDark ? { backgroundColor: '#121212', color: '#E3E3E3' } : { backgroundColor: 'white', color: 'black' }}>
                <div className="close-button-wrapper-outer">
                    <div className="image-preview">Image Preview</div>
                    <div className="close-button-wrapper-inner">
                        <MdClose className="close-button" onClick={onClose} />                        
                    </div>
                </div>
                <div className='image-name-container'>
                    <input type="text" className="image-alt-text" value={title || "Default Image"} style={isDark ? {backgroundColor : '#202020', color: "white"} : {backgroundColor: 'white', color: 'black'}} readOnly/>
                </div>
                <div className='image-container'>
                    <img src={imagePath}/>
                </div>
                <div className='image-size-container'>
                    <span className='image-size'>Size : {imageSize || "512KB"} </span> 
                    <span className='image-extension'>Extension : {imageExtension.toUpperCase() || "PNG"} </span>
                </div>
            </div>
        </div>
    );
}

export default ImagePopUpModal;
