import  { React, useState, useEffect, useRef } from "react";
import { MdArrowOutward } from "react-icons/md";

import '../Gallary/Gallary-view.css';

import AssetData from '../../DataModel/assetdetails.json';
import MultiSelectDropdown from '../multi-select-dropdown/multi-select-dropdown';
import SingleSelectDropdown from '../single-select-dropdown/multi-select-dropdown/single-select-dropdown';
import ImagePopUpModal from '../ImagePopUp/Popup';

function GalleryView() {
  const [options, setOptions] = useState([
    { Title: "JPG", value: "jpg" },
    { Title: "PNG", value: "png" },
    { Title: "JPEG", value: "jpeg" },
    { Title: "WEBP", value: "webp" },
    { Title: "GIF", value: "gif" }
  ]);

  const [sortByOptions, setsortByOptions] = useState([
    { Title: "A To Z", value: "asc" },
    { Title: "Z To A", value: "desc" }
  ]);

  const [Data, setData] = useState(AssetData);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [imagesToDisplay, setImagesToDisplay] = useState([]);
  const [isPaginationButtonHidden, setisPaginationButtonHidden] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const searchAssetRef = useRef(null);
  
  const assetIdToRemovemargin = [5,11,17,23,29,35,41,47,53,59,65]
  const imagesPerPage = 6;
  const totalPages = Math.ceil(Data.length / imagesPerPage);

  
  useEffect(() => {
    const startIndex = currentPage * imagesPerPage;
    const endIndex = (currentPage + 1) * imagesPerPage;
    setImagesToDisplay(Data.slice(startIndex, endIndex));
  }, [Data, currentPage, imagesPerPage]);

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  // below function return images by types. ex:- jpg,png,webp
  // function handleSelectedImageTypes(value) {   
  //   setSelectedOptions(value); 

  //   const filteredImages = Data.filter((image) => {
  //       const filePath = image.graphic._src;
  //       const extension = filePath.split('.').pop(); 
  //       return value.includes(extension);
  //   });

  //   if(!filteredImages.length){
  //     setisPaginationButtonHidden(true);
  //   }

  //   if(value.length){
  //     const paginatedAssets = getImagestoRenderPerPage(filteredImages);
  //     setImagesToDisplay(paginatedAssets); 
  //     console.log("imagesToDisplay-in-if ", imagesToDisplay)
  //   }else{
  //     const paginatedAssets = getImagestoRenderPerPage(Data);
  //     setImagesToDisplay(paginatedAssets); 
  //     console.log("imagesToDisplay-in-else ", imagesToDisplay)

  //     setisPaginationButtonHidden(false);
  //   }
  // }

  function handleSelectedImageTypes(value) {   
    setSelectedOptions(value); // Update selected options

    // Filter images based on selected extensions
    const filteredImages = Data.filter((image) => {
        const filePath = image.graphic._src;
        const extension = filePath.split('.').pop().toLowerCase(); // Ensure case insensitivity
        return value.includes(extension);
    });

    // Hide pagination button if no filtered images exist
    if (!filteredImages.length) {
        setisPaginationButtonHidden(true);
    }

    // Handle cases where value (extensions) is provided or not
    const paginatedAssets = value.length 
        ? getImagestoRenderPerPage(filteredImages) // Paginate filtered images
        : getImagestoRenderPerPage(Data);         // Paginate all images if no filter

    setImagesToDisplay(paginatedAssets); // Update the images to display
    setisPaginationButtonHidden(!value.length && filteredImages.length === 0);

    console.log("imagesToDisplay: ", paginatedAssets);
}


  // below function return images by filters. ex: a to z, z to a
  function handleSelectedFilterTypes(value) {   
    let sortedAssets;
    let assetsToSort = [...Data];  

    switch (value) {
      case 'asc':
        sortedAssets = assetsToSort.sort((a, b) => a.graphic._altText.localeCompare(b.graphic._altText));
        break;

      case 'desc':
        sortedAssets = assetsToSort.sort((a, b) => b.graphic._altText.localeCompare(a.graphic._altText));
        break;

      default:
        sortedAssets = Data;
        break;
    }

    const paginatedAssets = getImagestoRenderPerPage(sortedAssets);
    setImagesToDisplay(paginatedAssets); 
  }

  //below function for search images by name
  function handleSearchFilter(event) {   
    const searchValue = event.target.value.toLowerCase();
    const filteredAssets = Data.filter((asset) => 
      asset.graphic._altText.toLowerCase().includes(searchValue) 
    );

    const paginatedAssets = getImagestoRenderPerPage(filteredAssets);
    setImagesToDisplay(paginatedAssets); 
  }

  function getImagestoRenderPerPage(imagesToPaginate){
    const startIndex = currentPage * imagesPerPage;
    const endIndex = (currentPage + 1) * imagesPerPage;
    return imagesToPaginate.slice(startIndex, endIndex);
  }

  const handleOpenModal = (asset) => {
    setSelectedItem(asset); 
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setSelectedItem(null); 
    setIsModalOpen(false);  
  };

  return (
    <div className="gallery-view-main-container">
      <div className="gallery-wrapper-outer">
        <h5>Filters</h5>
        <div className="filter-wrapper">
          <input type="text" 
          className="search-asset" 
          placeholder="Search assets" 
          onChange={handleSearchFilter} 
          ref={searchAssetRef}/>
          
          <div className="dropdown-wrapper">            
            <MultiSelectDropdown 
              className="image-type-dropdown" 
              options={options} 
              onSelectOptions={handleSelectedImageTypes} 
            />
              
            <SingleSelectDropdown 
              title="Sort By" 
              options={sortByOptions}
              onSelectOptions={handleSelectedFilterTypes}   
            />
          </div>
        </div>
  
      <div className="gallery-wrapper-inner">
      {imagesToDisplay.length ? (
        imagesToDisplay.map((asset, index) => (
          <div
            className={`image-wrapper ${index % 2 === 0 ? 'large-image' : 'small-image'} ${
              assetIdToRemovemargin.includes(asset.id) ? 'remove-margin' : ''
            }`}
            key={asset.id}
          >
            <img
              src={asset.graphic._src}
              alt={asset.graphic._altText}
              className={index % 2 === 0 ? 'large' : 'small'}
            />
            <span
              className="open-popup-icon-wrapper"
              onClick={() => handleOpenModal(asset)} 
            >
              <MdArrowOutward className="open-in-popup-icon" title="open in popup" />
            </span>
            <span>{asset.graphic._altText}</span>
          </div>
        ))
      ) : (
        <div className="not-found-asset">
          <img src="assets/asset-not-found.png" alt="Not Found" />
          <span>Image Not Found</span>
        </div>
      )}

      {isModalOpen && selectedItem && (
        <ImagePopUpModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedItem.graphic._altText} 
          imagePath={selectedItem.graphic._src}
          imageSize={selectedItem.graphic._size}
          imageExtension={selectedItem.graphic._src.split('.').pop()}
        />
      )}
    </div>

      <div className="pagination-wrapper">
        <button className={`btn ${currentPage == 0 ? 'remove-event' : 'add-event'} ${isPaginationButtonHidden ? 'hide' : 'show'}`} onClick={handlePrevious}>Previous</button>
        <button className={`btn ${currentPage == 10 ? 'remove-event' : 'add-event'} ${isPaginationButtonHidden ? 'hide' : 'show'}`} onClick={handleNext}>Next</button>
      </div>

    </div>
  </div>
  
  );
}

export default GalleryView;