import * as tf from '@tensorflow/tfjs';
import dictionary from '../assets/dictionary.json';

export default class Model {
    TOKENS_BEFORE_PREDICTION = 19;
    TOKENS_PREDICTED = 1;

    constructor(predicted_size = 30) {
        this.model = null;
        this.predicted_size = predicted_size;

        this.ENCODING_DICT = {};
        this.DECODING_DICT = {};

        for (let i = 0; i < dictionary.length; i++) {
            const word = dictionary[i];

            this.ENCODING_DICT[word] = i;
            this.DECODING_DICT[i] = word;
        }
    }

    async load() {
        this.model = await tf.loadLayersModel('./model/model.json');
    }

    pad_sequences(sequence) {
        const zeros = Array(this.TOKENS_BEFORE_PREDICTION).fill(0);
        const padded = zeros.concat(sequence);
        return padded.slice(padded.length - this.TOKENS_BEFORE_PREDICTION);
    }

    argmax(sequence) {
        return Array.from(sequence)
            .map((value, index) => [value, index])
            .reduce((x, y) => x[0] > y[0] ? x : y)[1];
    }

    predict(seed) {
        if (this.model === null) {
            return 'Loading...';
        }

        const tokenized_text = seed.split(' ').map(word => this.ENCODING_DICT[word]);
        const PREDICT_UNTIL = this.predicted_size + tokenized_text.length;

        while (tokenized_text.length < PREDICT_UNTIL) {
            const padded = this.pad_sequences(tokenized_text);
            const softmax_output = this.model.predict(tf.tensor([padded])).dataSync();
            const prediction = this.argmax(softmax_output) + 1;
            tokenized_text.push(prediction);
        }

        return tokenized_text.map(code => this.DECODING_DICT[code]).join(' ');
    }
}
