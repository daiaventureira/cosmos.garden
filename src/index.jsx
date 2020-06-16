import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout';
import Loading from './components/Loading';
import PredictionWorker from 'workerize-loader!./workers/predictor'; // eslint-disable-line import/no-webpack-loader-syntax
import {JWT} from 'google-auth-library';
import keys from './assets/jwt.keys.json';

class App extends React.Component {
    constructor() {
        super();
        this.state = {messages: null};
    }

    async componentDidMount() {
        const client = new JWT({
            email: keys.client_email,
            key: keys.private_key,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        const url = `https://ml.googleapis.com/v1/projects/${keys.project_id}/models/horoscope/versions/v1:predict`;

        try {
            const result = await client.request({
                url,
                method: 'POST',
                data: {instances: []}
            });

            this.setState({messages: result.data.predictions});
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return this.state.messages !== null ?
            <Layout messages={this.state.messages} /> :
            <Loading />;
    }
}

ReactDOM.render (<App />, document.querySelector('#root'));
