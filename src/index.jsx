import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout';
import Loading from './Loading';

class App extends React.Component {
    render() {
        if(false){
            return <Layout />;
        }else{
            return <Loading />;        
        }
    }
}

ReactDOM.render (<App />, document.querySelector('#root'));
