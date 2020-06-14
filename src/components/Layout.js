import React from 'react';
import index from './index.scss';
import Controller from './Controller'
import { ReactComponent as Star} from '../assets/star.svg';
 
class Layout extends React.Component{

    render(){
        return(
            <div className="container">
                <div className="main-margins">
                    <div className="space-ray tl"></div>
                    <div className="space-ray tr"></div>
                    <div className="space-ray bl"></div>
                    <div className="space-ray br"></div>
    
                    <div className="star-david tl">
                        <Star />
                    </div>
                    <div className="star-david tr">
                        <Star />
                    </div>
                    <div className="star-david bl">
                        <Star />
                    </div>
                    <div className="star-david br">
                        <Star />
                    </div> 
                    <div>
                        <Controller messages={this.props.messages}/>
                    </div>   
                     
                    <div className="circles-top-left"></div>
                    <div className="inside-margin-left"></div>      
                    <div className="bar-top"></div>
                    <div className="bar-bottom"></div>
                    <div className="outside-margin-right"></div>
                    <div className="outside-margin-left"></div> 
                </div>
            </div>
        );    
}
}

export default Layout;