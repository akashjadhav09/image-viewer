import { useState,useEffect, useRef } from "react";
import { MdArrowDropDown } from "react-icons/md";

import './single-select-dropdown.css'
import '../../../../src/App.css'

function SingleSelectDropdown({title, options, onSelectOptions}) {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
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

    function handleToggle(event){
        event.stopPropagation();
        setIsDropDownOpen(!isDropDownOpen);
    }

    const handleRadioButtonChange = (value) => {
        setSelectedOption(value);
        onSelectOptions(value);
    };

    return (
        <div className="single-select-dropdown-main">
            <div 
                className="title-wrapper"    
                onClick={(event) => {handleToggle(event)}}
            >
                <div>{title}</div>
                <MdArrowDropDown className="drop-down-icon"/>
            </div>
            <div id="single-select-dropdown" className={`options-list ${isDropDownOpen ? 'show':'hide'}`} ref={dropdownRef}>
            {isDropDownOpen && options.map((option, index) => (
                <div key={index} className="option-item">
                    <input 
                    type="radio" 
                    id={`sortby-${index}`}
                    onChange={()=> handleRadioButtonChange(option.value)}
                    checked={selectedOption === option.value}
                    name="sortby" />
                    <label htmlFor={`sortby-${index}`}>{option.Title}</label>
                </div>
            ))}               
             </div>         
        </div>
    );
}

export default SingleSelectDropdown;
