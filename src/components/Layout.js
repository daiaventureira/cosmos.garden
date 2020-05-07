import React from 'react';
import index from './index.scss';

const Layout = props => {
    return(
    <div className="container">

        <div className="main-margins">
            <div className="star-sign">{props.text}</div>
            <div className="horoscope-of-day"><p>{props.horoscopeOfDay}</p></div>
            <div className="circles-top-left"></div>
            <div className="circles-top-right"></div>  
            <div className="circles-bottom-left"></div>
            <div className="circles-bottom-right"></div>  
            <div className="line1-top-left"></div>
            <div className="line2-top-left"></div>
            <div className="line3-top-left"></div>     
            <div className="line4-top-left"></div> 
            <div className="line5-top-left"></div>                   
            <div className="line6-top-left"></div>                   
            <div className="line7-top-left"></div>                   
            <div className="bar-top"></div>
            <div className="bar-bottom"></div>
            <div className="diamond-shape"></div>
            <div className="outside-margin-right"></div>
            <div className="outside-margin-left"></div> 
        </div>
    </div>
    )
}

export default Layout;