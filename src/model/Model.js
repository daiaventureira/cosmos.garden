import * as tf from '@tensorflow/tfjs';
import dictionary from '../assets/dictionary.json';

export default class Model {
    TOKENS_BEFORE_PREDICTION = 29;
    TOKENS_PREDICTED = 1;
    YEAR_MEAN = 2014.5;
    YEAR_STD = 3.452052529534663;

    constructor(predicted_size = 30, loading_phrase = 'Loading...') {
        this.model = null;
        this.predicted_size = predicted_size;
        this.loading_phrase = loading_phrase;

        this.ENCODING_DICT = {};
        this.DECODING_DICT = {};

        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        this.year = (year - this.YEAR_MEAN) / this.YEAR_STD;

        this.cos_mon = Math.cos(Math.PI * 2 * month / 12.0)
        this.sin_mon = Math.cos(Math.PI * 2 * month / 12.0)

        this.cos_day = Math.cos(Math.PI * 2 * day / 31.0)
        this.sin_day = Math.cos(Math.PI * 2 * day / 31.0)

        for (let i = 0; i < dictionary.length; i++) {
            const word = dictionary[i];

            this.ENCODING_DICT[word] = i;
            this.DECODING_DICT[i] = word;
        }
    }

    async load() {
        this.model = await tf.loadLayersModel('./model/model.json', {strict: false});
    }

    pad_sequences(sequence) {
        const zeros = Array(this.TOKENS_BEFORE_PREDICTION).fill(0);
        const padded = zeros.concat(sequence);
        return tf.tensor(padded.slice(padded.length - this.TOKENS_BEFORE_PREDICTION));
    }

    argmax(sequence) {
        return Array
            .from(sequence)
            .map((value, index) => [value, index])
            .reduce((x, y) => x[0] > y[0] ? x : y)[1];
    }

    predict(star_sign) {
        if (this.model === null) {
            return this.loading_phrase;
        }

        const seed = 'Today you will';

        const star_sign_ohe = tf.zeros([12]);
        star_sign_ohe[star_sign] = 1;

        const date_feats = tf.tensor([
            this.year,
            this.cos_mon,
            this.sin_mon,
            this.cos_day,
            this.sin_day
        ]);

        const static_feats = tf.concat([date_feats, star_sign_ohe]).reshape([1, -1]);

        this.model.resetStates();

        const tokenized_text = seed.split(' ').map(word => this.ENCODING_DICT[word]);
        const PREDICT_UNTIL = this.predicted_size + tokenized_text.length;

        while (tokenized_text.length < PREDICT_UNTIL) {
            const padded = this.pad_sequences(tokenized_text).reshape([1, -1]);

            const output = this.model.predict([padded, static_feats]).dataSync();
            const reshaped_output = tf.tensor(output).reshape([this.TOKENS_BEFORE_PREDICTION, -1]);

            const predicted_id = tf.multinomial(reshaped_output, 1).dataSync().slice(-1)[0];

            tokenized_text.push(predicted_id);
        }

        return tokenized_text.map(code => this.DECODING_DICT[code]).join(' ');
    }
}
