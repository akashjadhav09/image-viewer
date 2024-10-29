import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

import './single-select-dropdown.css'
import '../../../../src/App.css'

function SingleSelectDropdown({title,options}) {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    function handleToggle(){
        setIsDropDownOpen(!isDropDownOpen);
    }

    return (
        <div className="single-select-dropdown-main">
            <div className="title-wrapper" onClick={handleToggle}>
                <div>{title}</div>
                <MdArrowDropDown className="drop-down-icon"/>
            </div>
            <div className={`options-list ${isDropDownOpen ? 'show' : 'hide'}`}>
                {isDropDownOpen && options.map((option, index) => (
                    <div key={index} className="option-item">
                        <input 
                        type="radio" 
                        id={`sortby-${index}`}
                        name="sortby" />
                        <label htmlFor={`sortby-${index}`}>{option.Title}</label>
                    </div>
                ))}               
            </div>
        </div>
    );
}

export default SingleSelectDropdown;
