import React, { useState } from 'react';
import styles from '../styles/filter.scss';


const Filter = () => {
    const [isRegionActive, setIsRegionActive] = useState(false);
    const handleRegionToggle = () => {
        setIsRegionActive(!isRegionActive);
    };

    const [isPriceActive, setIsPriceActive] = useState(false);
    const handlePriceToggle = () => {
        setIsPriceActive(!isPriceActive);
    };

    const [isAreaActive, setIsAreaActive] = useState(false);
    const handleAreaToggle = () => {
        setIsAreaActive(!isAreaActive);
    };

    const [isRoomsActive, setIsRoomsActive] = useState(false);
    const handleRoomsToggle = () => {
        setIsRoomsActive(!isRoomsActive);
    };

    return (
        <div className='filter-holder'>
            <div id='filter'>
                <ul>
                    <li>
                        <div className='region'>
                            <div className='region-label' onClick={handleRegionToggle}>
                                <h2>რეგიონი</h2>
                                <img id='region-down-arrow' src='/images/down-icon.svg' className={`box ${isRegionActive ? 'active' : ''}`}/>
                                <img id='region-up-arrow'src='/images/up-icon.svg' className={`box ${isRegionActive ? 'active' : ''}`}/>
                            </div>
                            <select id="region-select" name='region-select' className={`box ${isRegionActive ? 'active' : ''}`}>
                                <option value="abkhazia">აფხაზეთი</option>
                                <option value="ajaria">აჭარა</option>
                                <option value="Guria">გურია</option>
                                <option value="imereti">იმერეთი</option>
                                <option value="kakheti">კახეთი</option>
                                <option value="kvemo kartli">ქვემო ქართლი</option>
                                <option value="mtskheta-mtianeti">მცხეთა-მთიანეთი</option>
                                <option value="racha-lechkhumi-kvemo svaneti">რაჭა-ლეჩხუმი-ქვემო სვანეთი</option>
                                <option value="samegrelo-zemo svaneti">სამეგრელო-ზემო სვანეთი</option>
                                <option value="samtskhe-javakheti">სამცხე-ჯავახეთი</option>
                                <option value="shida kartli">შიდა ქართლი</option>
                                <option value="tbilisi" selected="selected">თბილისი</option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <div className='price'>
                            <div className='price-label' onClick={handlePriceToggle}>
                                <h2>საფასო კატეგორია</h2>
                                <img id='price-down-arrow' src='/images/down-icon.svg' className={`box ${isPriceActive ? 'active' : ''}`}/>
                                <img id='price-up-arrow'src='/images/up-icon.svg' className={`box ${isPriceActive ? 'active' : ''}`}/>
                            </div>
                            <input type='range' id='price-slider' name='price-slider' min='0' max='1000000' className={`box ${isPriceActive ? 'active' : ''}`}/>
                        </div>
                    </li>

                    <li>
                        <div className='area'>
                            <div className='area-label' onClick={handleAreaToggle}>
                                <h2>ფართობი</h2>
                                <img id='area-down-arrow' src='/images/down-icon.svg' className={`box ${isAreaActive ? 'active' : ''}`}/>
                                <img id='area-up-arrow'src='/images/up-icon.svg' className={`box ${isAreaActive ? 'active' : ''}`}/>
                            </div>
                            <input type='range' id='area-slider' name='area-slider' min='0' max='10000' className={`box ${isAreaActive ? 'active' : ''}`}/>
                        </div>
                    </li>
                    <li>
                        <div className='rooms'>
                            <div className='rooms-label' onClick={handleRoomsToggle}>
                                <h2>საძინებლების რაოდენობა</h2>
                                <img id='rooms-down-arrow' src='/images/down-icon.svg' className={`box ${isRoomsActive ? 'active' : ''}`}/>
                                <img id='rooms-up-arrow'src='/images/up-icon.svg' className={`box ${isRoomsActive ? 'active' : ''}`}/>
                            </div>
                            <select id="rooms-select" name='rooms-select' className={`box ${isRoomsActive ? 'active' : ''}`}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5+">5+</option>
                            </select>
                        </div>
                    </li>
                </ul>
            </div>
            <div id='filter-buttons'>
                <div id='add-listing' className='button'>
                    <img src='/images/plus-icon-white.svg'/>
                    <h2>ლისტინგის დამატება</h2>
                </div>
                <div id='add-agent' className='button'>
                    <img src='/images/plus-icon-orange.svg'/>
                    <h2>აგენტის დამატება</h2>
                </div>
            </div>
        </div>
    );
}

export default Filter;