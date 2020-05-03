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
                <Layout 
                    text = "Star Sign"
                    horoscopeOfDay = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                />
            </div>
        );
    }
}

ReactDOM.render (<App />, document.querySelector('#root'));
