from __future__ import unicode_literals

from tqdm.auto import tqdm
from tqdm.contrib.concurrent import process_map
import pandas as pd
from datetime import datetime
from functools import partial, reduce

from spiders.horoscope_com import HoroscopeCom
from spiders.sagittarius_com import SagittariusCom
from spiders.astrologycafe import AstrologyCafe
from spiders.horoscopezen import HoroscopeZen

from multiprocessing import Pool, RLock

if __name__ == '__main__':
    SPIDERS = [
        # HoroscopeCom,
        # SagittariusCom,
        HoroscopeZen,
    ]

    now = datetime.today().strftime('%Y%m%d%H%M%S%f')

    def read_messages(spider, star_sign_index):
        sign_horoscope_messages = spider(star_sign_index)

        MESSAGES = []

        for payload in tqdm(sign_horoscope_messages, desc=(str(sign_horoscope_messages) + ' messages for ' + str(star_sign_index)), leave=False, position=star_sign_index + 1):
            MESSAGES.append(payload)

        return MESSAGES

    for spider in tqdm(SPIDERS, desc='Spiders', leave=False):
        for i in range(2):
            tqdm.set_lock(RLock())

            p = Pool(6, initializer=tqdm.set_lock, initargs=(tqdm.get_lock(),))

            results = p.map(partial(read_messages, spider), range(i * 6, i * 6 + 6))
            results = reduce(lambda x, y: x + y, results)

            p.close()

            pd.DataFrame\
                .from_dict(results)\
                .to_csv(
                    './data/raw_corpora_%s_part_%d.csv' % (now, i),
                    index=None,
                    encoding='utf8',
                    header=True,
                    mode='a'
                )
