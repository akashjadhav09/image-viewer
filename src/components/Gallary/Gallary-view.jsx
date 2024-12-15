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
  const [paginationValue, setPaginationValue] = useState(Array.from({ length: Math.ceil(Data.length / 6) }, (_, index) => index + 1));
  let [openIndex, setOpenIndex] = useState(0);
  const [isHideNextBtn, setIsHideNextBtn] = useState(false);
  const [isHidePrevBtn, setIsHidePrevBtn] = useState(false);
  
  // const assetIdToRemovemargin = [5,11,17,23,29,35,41,47,53,59,65]
  const assetIdToRemovemargin = Array.from({ length: Math.ceil(Data.length / 6) }, (_, i) => 5 + i * 6);

  const imagesPerPage = 6;
  const totalPages = Math.ceil(Data.length / imagesPerPage);
   
  useEffect(() => {
    const images = selectedOptions.length
      ? Data.filter((image) => {
          const filePath = image.graphic._src;
          const extension = filePath.split('.').pop();
          return selectedOptions.includes(extension);
        })
      : Data; // Show all images when no option is selected
  
    const startIndex = currentPage * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
           
    if(currentPage === 0){
      setIsHidePrevBtn(true);
    }else{
      setIsHidePrevBtn(false);
    }

    setImagesToDisplay(images.slice(startIndex, endIndex));
  }, [Data, currentPage, imagesPerPage, selectedOptions, paginationValue]);
  
  
  const handleNext = () => {
    const maxPages = selectedOptions.length
      ? Math.ceil(
          Data.filter((image) => {
            const filePath = image.graphic._src;
            const extension = filePath.split('.').pop();
            return selectedOptions.includes(extension);
          }).length / imagesPerPage
        )
      : totalPages;
  
    setCurrentPage((prevPage) => {      
      const nextPage = prevPage + 1;
      if (nextPage >= maxPages) {
        setIsHideNextBtn(true);
        return prevPage;
      }
      setIsHidePrevBtn(false);
      return nextPage;
    });

    setOpenIndex(currentPage + 1);
    // setPaginationValue(maxPages);

    if(currentPage + 2 >= maxPages){
      setIsHideNextBtn(true);
    }else{
      setIsHideNextBtn(false);
    }
  };
  
  const handlePrevious = () => {
    setCurrentPage((prevPage) => {
      const prevPageIndex = prevPage - 1;
      if (prevPageIndex < 0) {
        setIsHidePrevBtn(true);
        return prevPage;
      }
      setIsHideNextBtn(false);
      return prevPageIndex;
    });

    setOpenIndex(currentPage - 1);
   
    if(currentPage - 1 === 0){
      setIsHidePrevBtn(true);
    }else{
      setIsHidePrevBtn(false);
    }
  };

  // below function return images by types. ex:- jpg,png,webp
  function handleSelectedImageTypes(value) {
    setSelectedOptions(value);
  
    const filteredImages = value.length
      ? Data.filter((image) => {
          const filePath = image.graphic._src;
          const extension = filePath.split('.').pop();
          return value.includes(extension);
        })
      : Data; // Use all images when no option is selected
  
    setCurrentPage(0); // Reset to the first page
    setIsHideNextBtn(false); // Reset next button visibility
    setIsHidePrevBtn(true); // Reset prev button visibility
  
    const startIndex = 0;
    const endIndex = imagesPerPage;
  
    if (filteredImages.length) {
      setImagesToDisplay(filteredImages.slice(startIndex, endIndex));
      setisPaginationButtonHidden(false);
    } else {
      setImagesToDisplay([]);
      setisPaginationButtonHidden(true);
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
          <div className={`navbar-wrapper-outer ${isDark ? 'navbar-bg-color-dark' : 'navbar-bg-color-light'} ${isModalOpen ? 'disable-event' : 'enable-event'}`}>
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
      {imagesToDisplay.length ? (
        imagesToDisplay.map((asset, index) => (
          <div
            className={[
              'image-wrapper',
              index % 2 === 0 ? 'large-image' : 'small-image',
              assetIdToRemovemargin.includes(asset.id) ? 'remove-margin' : '',
            ].join(' ').trim()} 
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
          isDark={isDark}
        />
      )}
      
    </div>  
   
    <div className="pagination-wrapper-outer">      
      {paginationValue.length ? (
        <div className="dot-wrapper">
          {paginationValue.map((_asset, index) => (
            <div 
              key={index} 
              className={`dot-container-inner dot ${openIndex === index ? 'item-dot-green' : ''} ${isPaginationButtonHidden ? 'hidden' : 'visible'}`}
            ></div>
          ))}
        </div>
      ) : null}

      <div className="pagination-wrapper">
        <button className={`btn ${isHidePrevBtn || isPaginationButtonHidden ? 'hidden' : 'visible'} `} onClick={handlePrevious}>Previous</button>
        <button className={`btn ${isHideNextBtn || isPaginationButtonHidden ? 'hidden' : 'visible'} `} onClick={handleNext}>Next</button>
      </div>
    </div>

    </div>
  </div>
  
  );
}

export default GalleryView;