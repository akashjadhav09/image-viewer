import { React, useState, useEffect, useRef } from "react";
import { MdArrowOutward, MdSunny, MdOutlineWbSunny } from "react-icons/md";

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
  const [isDark, setisDark] = useState(false);
  const [paginationValue, setpaginationValue] = useState(Array.from({ length: Math.ceil(Data.length / 6) }, (_, index) => index + 1));
  const [openIndex, setopenIndex] = useState(0);
  
  const assetIdToRemovemargin = [5,11,17,23,29,35,41,47,53,59,65]
  const imagesPerPage = 6;
  const totalPages = Math.ceil(Data.length / imagesPerPage);
   
  useEffect(() => {
    const startIndex = currentPage * imagesPerPage;
    const endIndex = (currentPage + 1) * imagesPerPage;
    setImagesToDisplay(Data.slice(startIndex, endIndex));
  }, [Data, currentPage, imagesPerPage]);

  const handleNext = () => {
    setopenIndex((prevIndex)=> (prevIndex+1))
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevious = () => {
    setopenIndex((prevIndex)=> (prevIndex-1))
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  // below function return images by types. ex:- jpg,png,webp
  function handleSelectedImageTypes(value) {   
    setSelectedOptions(value); 

    const filteredImages = Data.filter((image) => {
        const filePath = image.graphic._src;
        const extension = filePath.split('.').pop(); 
        return value.includes(extension);
    });

    if(!filteredImages.length){
      setisPaginationButtonHidden(true);
    }

    if(value.length){
      const paginatedAssets = getImagestoRenderPerPage(filteredImages);
      setImagesToDisplay(paginatedAssets); 
      console.log("imagesToDisplay-in-if ", imagesToDisplay)
    }else{
      const paginatedAssets = getImagestoRenderPerPage(Data);
      setImagesToDisplay(paginatedAssets); 
      console.log("imagesToDisplay-in-else ", imagesToDisplay)

      setisPaginationButtonHidden(false);
    }
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

  const toggleTheme = () => {
    setisDark((prevTheme) => !prevTheme);
  };
  

  return (
    <div className={`gallery-view-main-container ${isDark ? 'dark-mode' : 'light-mode'}`}>
      <div className="gallery-wrapper-outer">       
          <div className={`navbar-wrapper-outer ${isDark ? 'navbar-bg-color-dark' : 'navbar-bg-color-light'}`}>
            <div className="filter-title-warpper">
              <span>Filter</span>
              <input type="text" 
                className="search-asset" 
                placeholder="Search assets" 
                onChange={handleSearchFilter} 
                ref={searchAssetRef}/>
            </div>             
                   
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

              <div onClick={toggleTheme}>
                {isDark ? (
                  <MdOutlineWbSunny className="light-theme-icon" title="Light Mode" />
                ) : (
                  <MdSunny className="dark-theme-icon" title="Dark Mode" />
                )}
              </div>         
            
            </div>
          </div>
  
      <div className={`${!imagesToDisplay.length ? 'image-not-found-wrapper' : 'gallery-wrapper-inner'}`}>
      {/* {console.log("imagesToDisplay ", imagesToDisplay)} */}
      {imagesToDisplay.length ? (
        imagesToDisplay.map((asset, index) => (
          <div
            className={`image-wrapper ${index % 2 === 0 ? 'large-image' : 'small-image'} ${
              assetIdToRemovemargin.includes(asset.id) ? 'remove-margin' : ''
            }`}
            key={asset.id}
          >
            <img
              key={asset.id}
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
          <div>Image Not Found</div>
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
   
    {paginationValue.length ? (
      <div className="dot-wrapper">
        {paginationValue.map((_asset, index) => (
          <div 
            key={index} 
            className={`dot-container-inner dot ${openIndex === index ? 'item-dot-green' : ''}`}
          ></div>
        ))}
      </div>
    ) : null}


      <div className="pagination-wrapper">
        <button className={`btn ${currentPage == 0 ? 'remove-event' : 'add-event'} ${isPaginationButtonHidden ? 'hide' : 'show'}`} onClick={handlePrevious}>Previous</button>
        <button className={`btn ${currentPage == 10 ? 'remove-event' : 'add-event'} ${isPaginationButtonHidden ? 'hide' : 'show'}`} onClick={handleNext}>Next</button>
      </div>

    </div>
  </div>
  
  );
}

export default GalleryView;