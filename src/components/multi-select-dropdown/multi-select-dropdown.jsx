import { useEffect, useState, useRef } from "react";
import { MdArrowDropDown } from "react-icons/md";

import './multi-select-dropdown.css'

function MultiSelectDropdown({ options, onSelectOptions, isOpen, onToggle  }) {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]); 
    const dropdownRef = useRef(null);

    useEffect(()=>{
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropDownOpen(false);
            }
        };

        window.addEventListener("click", handleOutsideClick);

        return()=>{
            window.removeEventListener("click", handleOutsideClick);
        }
    },[])

    const handleCheckboxChange = (value) => {
        const updatedOptions = selectedOptions.includes(value)
            ? selectedOptions.filter((option) => option !== value) 
            : [...selectedOptions, value]; 
    
        setSelectedOptions(updatedOptions); 
        onSelectOptions(updatedOptions);
    };
    
    
    const handleToggle = (event) => {
        event.stopPropagation();
        setIsDropDownOpen((prevState) => !prevState);
    };

    return (
        <div className="multi-select-dropdown-main">
            <div 
                className="title-wrapper"  
                onClick={(event) => {
                event.stopPropagation();
                onToggle("single");}}
            >

                <div className="drop-down-title">File Type</div>
                <MdArrowDropDown className="drop-down-icon"/>
            </div>
            {isOpen && (
                <div id="multi-select-dropdown" className="options-list" ref={dropdownRef}>
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
            )}
            
        </div>
    );
}

export default MultiSelectDropdown;
