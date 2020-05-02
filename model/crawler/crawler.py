from __future__ import unicode_literals

from tqdm import tqdm
import pandas as pd

from spiders.horoscope_com import HoroscopeCom
from spiders.sagittarius_com import SagittariusCom

if __name__ == '__main__':
    SPIDERS = [
        HoroscopeCom,
        SagittariusCom,
    ]

    STAR_SIGNS = SPIDERS[0].STAR_SIGNS

    for (star_sign_index, _) in tqdm(STAR_SIGNS, desc='Star Signs'):
        for spider in tqdm(SPIDERS, desc='Spiders', leave=False):
            MESSAGES = []

            sign_horoscope_messages = spider(star_sign_index)

            for payload in tqdm(sign_horoscope_messages, desc=(str(sign_horoscope_messages) + ' messages'), leave=False):
                MESSAGES.append(payload)

            pd.DataFrame\
                .from_dict(MESSAGES)\
                .to_csv('./data/raw_corpora.csv', index=None, encoding='utf8', header=(star_sign_index == 0), mode='a')
