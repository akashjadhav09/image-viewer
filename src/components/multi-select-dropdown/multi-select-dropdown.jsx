import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

import './multi-select-dropdown.css'

function MultiSelectDropdown({ options, onSelectOptions }) {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleCheckboxChange = (value) => {
        const updatedOptions = selectedOptions.includes(value)
            ? selectedOptions.filter((option) => option !== value)
            : [...selectedOptions, value];

        setSelectedOptions(updatedOptions)
        onSelectOptions(updatedOptions);
    }

    function handleToggle(){
        setIsDropDownOpen(!isDropDownOpen);
    }

    return (
        <div className="multi-select-dropdown-main">
            <div className="title-wrapper" onClick={handleToggle}>
                <div className="drop-down-title">File Type</div>
                <MdArrowDropDown className="drop-down-icon"/>
            </div>
            <div className={`options-list ${isDropDownOpen ? 'show' : 'hide'}`}>
                {isDropDownOpen && 
                    options.map((option,index)=>(
                        <div className="my-checkbox" key={index}>
                            <input type="checkbox" 
                                id={`image-type-${index}`} 
                                onChange={()=> handleCheckboxChange(option.value)}
                            /> 
                            <label htmlFor={`image-type-${index}`} className="label">{option.Title}</label>
                        </div>
                    ))
                }                
            </div>
        </div>
    );
}

export default MultiSelectDropdown;
