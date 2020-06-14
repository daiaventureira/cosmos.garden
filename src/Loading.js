import React, {Component} from 'react';

class Loading extends Component{
    
    render(){
        return(
                <div className='loading-page'>
                    <div className='box'>
                        <div className='loading-title'>
                            Cosmos Garden
                        </div>
                        <div className='loading-image'></div>
                        <div className='loading-text'>Consulting the Stars...</div>
                    </div>   
                </div>
        );
    }
}

export default Loading;