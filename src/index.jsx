import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout';
import Loading from './components/Loading';
import PredictionWorker from 'workerize-loader!./workers/predictor'; // eslint-disable-line import/no-webpack-loader-syntax

class App extends React.Component {
    constructor() {
        super();

        this.state = {messages: null};

        this.predictor = new PredictionWorker();

        this.predictor.predict().then(messages => {
            this.setState({messages});
            this.predictor.terminate();
        });
    }

    render() {
        return this.state.messages !== null ? 
            <Layout messages={this.state.messages} /> : 
            <Loading />;
    }
}

ReactDOM.render (<App />, document.querySelector('#root'));
