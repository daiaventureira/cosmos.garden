import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout';

const App = () => {
    return(
        <div>
            <Layout

            />
        </div>    
    );
}

ReactDOM.render (<App />, document.querySelector('#root'));