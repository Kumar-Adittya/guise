import React from 'react';
import { brand_logo } from '../images/index' 

const Header = (props) => { 
        return (
            <div className="main-header"> 
                <div className="container inner-wrap">
                    <img src={brand_logo} alt="guise" />
                </div>
            </div>
        ); 
};

export default Header;