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

    available() {
        return this.model !== null;
    }

    async load() {
        this.model = await tf.loadLayersModel('./model/model.json', {strict: false});
    }

    predict() {
        return tf.tidy(() => this._predict());
    }

    _predict() {
        if (this.model === null) {
            return Array(12).fill(this.loading_phrase);
        }

        const seed = 'today you will';

        let star_sign_ohe = [];

        for (let i = 0; i < 12; i++) {
            const z = Array(12).fill(0);
            z[i] = 1;
            star_sign_ohe.push(z);
        }

        star_sign_ohe = tf.tensor(star_sign_ohe);

        let date_feats = tf.tensor([
            this.year,
            this.cos_mon,
            this.sin_mon,
            this.cos_day,
            this.sin_day
        ]);

        date_feats = tf
            .tile(date_feats, [12])
            .reshape([12, -1]);

        const static_feats = tf.concat([date_feats, star_sign_ohe], 1);

        let tokenized_text = seed.split(' ').map(word => this.ENCODING_DICT[word]);
        let tokens_so_far = tokenized_text.length;

        tokenized_text = tf.tensor(tokenized_text);
        tokenized_text = tokenized_text.pad([[this.TOKENS_BEFORE_PREDICTION, 0]]);
        tokenized_text = tokenized_text.tile([12]).reshape([12, -1]);

        const PREDICT_UNTIL = this.predicted_size + tokens_so_far;
        this.model.resetStates();

        while (tokens_so_far < PREDICT_UNTIL) {
            let piece = tokenized_text
                .slice([0, tokenized_text.shape[1] - this.TOKENS_BEFORE_PREDICTION], [12, -1]);

            const output = this.model
                .predict([piece, static_feats])
                .slice([0, this.TOKENS_BEFORE_PREDICTION - 1, 0], [12, 1, -1])
                .squeeze();

            const prediction = tf.multinomial(output, 1);

            tokenized_text = tokenized_text.concat(prediction, 1);

            piece.dispose();
            output.dispose();
            prediction.dispose();

            tokens_so_far++;
        }

        const sequences = Array.from(
            tokenized_text
                .slice([0, tokenized_text.shape[1] - PREDICT_UNTIL], [12, -1])
                .dataSync()
        );

        const messages = []

        for (let i = 0; i < 12; i ++) {
            const j = sequences.length / 12;

            const message = sequences
                .slice(i * j, i * j + j)
                .map(code => this.DECODING_DICT[code])
                .join(' ');

            messages.push(message);
        }

        return messages;
    }
}
