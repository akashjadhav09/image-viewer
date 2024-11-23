import { useState,useEffect, useRef } from "react";
import { MdArrowDropDown } from "react-icons/md";

import './single-select-dropdown.css'
import '../../../../src/App.css'

function SingleSelectDropdown({title, options, isOpen, onToggle  }) {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
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

    return (
        <div className="single-select-dropdown-main">
            <div 
                className="title-wrapper"    
                onClick={(event) => {
                event.stopPropagation();
                onToggle("single");}}
            >
                <div>{title}</div>
                <MdArrowDropDown className="drop-down-icon"/>
            </div>
            {isOpen && (
                 <div id="single-select-dropdown" className="options-list" ref={dropdownRef}>
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
            )}           
        </div>
    );
}

export default SingleSelectDropdown;
