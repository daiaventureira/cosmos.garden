import React, {Component} from 'react';
import {ReactComponent as Galaxy} from '../assets/galaxy.svg';

class Loading extends Component{
    
    render(){
        return(
                <div className='loading-page'>
                    <div className='box'>
                        <div className='loading-title'>
                            Cosmos Garden
                        </div>
                        <div className='loading-image'>
                            <Galaxy />
                        </div>
                        <div className='loading-text'>Hang on a second, we're consulting the stars...</div>
                        <div className='loading-about'>Cosmos Garden is a web app that tries to predict your daily horoscope. Use it with moderation.</div>
                    </div>   
                </div>
        );
    }
}

export default Loading;