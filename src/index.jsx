import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Layout from "./components/Layout";
import Loading from "./components/Loading";
import PredictionWorker from "workerize-loader!./workers/predictor"; // eslint-disable-line import/no-webpack-loader-syntax
import { JWT } from "google-auth-library";
import keys from "./assets/jwt.keys.json";

class App extends React.Component {
  constructor() {
    super();
    this.state = { messages: null, data: [] };
  }

  async componentDidMount() {
    axios
      .get("https://cosmos-garden-api.herokuapp.com/prediction/2021-02-17")
      .then((res) => {
        const data = res.data
          .sort((a, b) => a.sign - b.sign)
          .map((item) => item.message);
        this.setState({ data });
      });
  }

  render() {
    return this.state.data !== null ? (
      <Layout messages={this.state.data} />
    ) : (
      <Loading />
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
