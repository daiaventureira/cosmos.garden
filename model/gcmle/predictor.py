import os
import json
from datetime import datetime

import numpy as np
import tensorflow as tf

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

class Predictor(object):
    def __init__(self, model, dictionary):
        self._model = model

        self.TOKENS_BEFORE_PREDICTION = 29
        self.DECODING_DICT = dict(enumerate(dictionary))
        self.ENCODING_DICT = dict(zip(self.DECODING_DICT.values(), self.DECODING_DICT.keys()))

        self.SEED = 'today you will'

        self.YEAR_MEAN = 2014.5;
        self.YEAR_STD = 3.452052529534663;

    def predict(self, instances, **kwargs):
        star_sign_ohe = np.zeros([12, 12])
        np.fill_diagonal(star_sign_ohe, 1)
        star_sign_ohe = tf.constant(star_sign_ohe, dtype=tf.float32)

        today = datetime.today()

        year = (today.year - self.YEAR_MEAN) / self.YEAR_STD
        cos_mon = np.cos(np.pi * 2 * today.month / 12.0)
        sin_mon = np.cos(np.pi * 2 * today.month / 12.0)
        cos_day = np.cos(np.pi * 2 * today.day / 31.0)
        sin_day = np.cos(np.pi * 2 * today.day / 31.0)

        date_feats = tf.constant([[year, cos_mon, sin_mon, cos_day, sin_day]] * 12, dtype=tf.float32)

        static_feats = tf.concat([date_feats, star_sign_ohe], axis=1)

        tokenized_text = list(map(lambda t: self.ENCODING_DICT[t], self.SEED.split(' ')))
        tokens_so_far = len(tokenized_text)

        tokenized_text = tf.constant(tokenized_text)
        tokenized_text = tf.pad(tokenized_text, [[self.TOKENS_BEFORE_PREDICTION, 0]])
        tokenized_text = tf.reshape(tf.tile(tokenized_text, [12]), [12, -1])

        PREDICT_UNTIL = tokens_so_far + 20

        self._model.reset_states()

        while tokens_so_far < PREDICT_UNTIL:
            piece = tf.slice(tokenized_text, tf.constant([0, int(tokenized_text.shape[1] - self.TOKENS_BEFORE_PREDICTION)]), tf.constant([12, -1]))

            output = self._model.predict([piece, static_feats], steps=1)[:, -1, :]
            prediction = tf.random.categorical(output, num_samples=1, dtype=tf.int32)

            tokenized_text = tf.concat([tokenized_text, prediction], axis=1)

            tokens_so_far += 1

        sess = tf.Session()
        with sess.as_default():
            tokenized_text = tokenized_text.eval()
            tokenized_text = tokenized_text[:, tokenized_text.shape[1] - PREDICT_UNTIL:].tolist()
            return [' '.join(map(lambda code: self.DECODING_DICT[code], encoded)) for encoded in tokenized_text]

    @classmethod
    def from_path(cls, model_dir):
        model_path = os.path.join(model_dir, '2020.06.07.h5')
        model = tf.keras.models.load_model(model_path, compile=False)

        dict_path = os.path.join(model_dir, '2020.06.07.json')

        with open(dict_path) as f:
            dictionary = json.load(f)

        return cls(model, dictionary)

# if __name__ == '__main__':
#     p = Predictor.from_path('/Users/brenolf/cosmos.garden/model/models')
#     print(p.predict([]))
