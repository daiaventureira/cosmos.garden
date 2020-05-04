import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout';
import Model from './model/Model'

class App extends React.Component {
    state = {
        model: new Model()
    }

    async componentDidMount() {
        return; // Uncomment this to run the model
        await this.state.model.load();
        this.forceUpdate();
    }

    render() {
        const model = this.state.model;

        return (
            <div>
                <Layout/>
            </div>
        );
    }
}

ReactDOM.render (<App />, document.querySelector('#root'));
