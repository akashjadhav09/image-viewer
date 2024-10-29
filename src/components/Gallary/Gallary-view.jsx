import  { React, useState } from "react";
import { AssignmentTurnedIn } from "react-icons/md";

import '../Gallary/Gallary-view.css';
import AssetData from '../../DataModel/assetdetails.json';
import MultiSelectDropdown from '../multi-select-dropdown/multi-select-dropdown';
import SingleSelectDropdown from '../single-select-dropdown/multi-select-dropdown/single-select-dropdown';

function GalleryView() {
  const [options, setOptions] = useState([
    { Title: "JPG", value: "jpg" },
    { Title: "PNG", value: "png" },
    { Title: "JPEG", value: "jpeg" },
    { Title: "WEBP", value: "webp" },
    { Title: "GIF", value: "gif" }
  ]);

  const [sortByOptions, setsortByOptions] = useState([
    { Title: "A To Z", value: "a-to-z" },
    { Title: "Z To A", value: "z-to-a" }
  ]);

  const [Data, setData] = useState(AssetData);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const assetIdToRemovemargin = [5,11,17,23,29,35,41,47,53,59,65]
  const imagesPerPage = 6;
  const totalPages = Math.ceil(Data.length / imagesPerPage);

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  function handleSelectedImageTypes(value){
    setSelectedOptions(value);
  }

  const currentImages = Data.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  return (
    <div className="gallery-view-main-container">
    <div className="gallery-wrapper-outer">
      <h5>Filters</h5>
      <div className="filter-wrapper">
        <input type="text" className="search-asset" placeholder="Search assets" />
        <div className="dropdown-wrapper">
          <MultiSelectDropdown className="image-type-dropdown" options={options} onSelectOptions={handleSelectedImageTypes}/>
          <SingleSelectDropdown title="Sort By" options={sortByOptions}/>
        </div>
      </div>
  
      <div className="gallery-wrapper-inner">
        {currentImages.map((asset, index) => (
          <div
            className={`image-wrapper ${index % 2 === 0 ? 'large-image' : 'small-image'} ${assetIdToRemovemargin.includes(asset.id) ? 'remove-margin' : ''}`}
            key={asset.id}
          >
            <img
              src={asset.graphic._src}
              alt={asset.graphic._altText}
              className={index % 2 === 0 ? 'large' : 'small'}
            />
            <span className="open-in-popup-icon">
              <AssignmentTurnedIn/>
            </span>
          </div>
        ))}
      </div>
  
      <div className="pagination-wrapper">
        <button className={`btn ${currentPage == 0 ? 'remove-event' : 'add-event'}`} onClick={handlePrevious}>Previous</button>
        <button className={`btn ${currentPage == 10 ? 'remove-event' : 'add-event'}`} onClick={handleNext}>Next</button>
      </div>
    </div>
  </div>
  
  );
}

export default GalleryView;