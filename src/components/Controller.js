import React, {Component} from 'react';
import {ReactComponent as Arrow} from '../assets/arrow.svg';

import {ReactComponent as Aquarius} from '../assets/aquarius.svg';
import {ReactComponent as Libra} from '../assets/libra.svg';
import {ReactComponent as Leo} from '../assets/leo.svg';
import {ReactComponent as Taurus} from '../assets/taurus.svg';
import {ReactComponent as Cancer} from '../assets/cancer.svg';
import {ReactComponent as Sagittarius} from '../assets/sagittarius.svg';
import {ReactComponent as Scorpio} from '../assets/scorpio.svg';
import {ReactComponent as Virgo} from '../assets/virgo.svg';
import {ReactComponent as Pisces} from '../assets/pisces.svg';
import {ReactComponent as Gemini} from '../assets/gemini.svg';
import {ReactComponent as Capricorn} from '../assets/capricorn.svg';
import {ReactComponent as Aries} from '../assets/aries.svg';
import Model from '../model/Model';


class Controller extends Component{  
    state={counter:1, model: new Model()}

    constructor(){
        super();
        this.clickRightBottom = this.clickRightBottom.bind(this);
        this.clickLeftBottom =  this.clickLeftBottom.bind(this);
        this.nameList = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces' ];
        this.signList = [ <Aries/>, <Taurus />, < Gemini />, <Cancer />, <Leo />, <Virgo />, <Libra />, <Scorpio />, <Sagittarius />, <Capricorn />, <Aquarius />, <Pisces />];
        this.messages = Array(12).fill("loading");
    }

    clickRightBottom(){
        const counter = this.state.counter;

        if(counter===12){
            return  this.setState({
            counter: 1
            });     
        }
        this.setState({
            counter: counter+1
        })        
    }

    clickLeftBottom(){
        const counter = this.state.counter;

        if(this.state.counter === 1){
            return  this.setState({
                counter: 12
            })     
        }     
        this.setState({
            counter: counter-1
        });
    }

    render(){
        return(
            <div>
                <div className="star-sign-symbol">
                    {this.signList[this.state.counter-1]}                       
                </div>
                
                <div className="star-sign-name">
                    <div>
                        <div className="arrow" onClick={this.clickLeftBottom}><Arrow/></div>

                        <div className="star-sign">
                            {this.nameList[this.state.counter-1]}
                        </div>

                        <div className="arrow right" onClick={this.clickRightBottom}><Arrow /></div>
                    </div>
                </div>
                <div>
                <div  className="horoscope-of-day"><blockquote>{this.messages[this.state.counter - 1]}</blockquote></div>
                </div>
            </div>
        );          
    }

}

export default Controller;