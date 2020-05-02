from __future__ import unicode_literals

from datetime import date, timedelta
from lxml import html
import requests

class BaseSpider(object):
    STAR_SIGNS = list(enumerate([
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
    ]))

    @property
    def FIRST_DATE(self):
        raise NotImplementedError

    @property
    def LAST_DATE(self):
        raise NotImplementedError

    @property
    def QUERY_SELECTOR(self):
        raise NotImplementedError

    def __init__(self, star_sign, max_days_to_read=None):
        assert isinstance(star_sign, int)
        assert star_sign >= 0 and star_sign <= 11
        assert isinstance(max_days_to_read, int) or max_days_to_read is None

        self._TIMESPAN = (self.LAST_DATE - self.FIRST_DATE).days if max_days_to_read is None else max_days_to_read
        self.star_sign = star_sign

    def __str__(self):
        return self.__class__.__name__

    def _get_url(self, ref_date):
        raise NotImplementedError

    def _find_message_dom(self, dom):
        raise NotImplementedError

    def __iter__(self):
        self._days_read = 0
        return self

    def __len__(self):
        return self._TIMESPAN

    def next(self):
        if self._days_read == self._TIMESPAN:
            raise StopIteration

        doi = self.FIRST_DATE + timedelta(days=self._days_read)
        self._days_read += 1

        page = requests.get(self.get_url(doi))
        tree = html.fromstring(unicode(page.content, errors='ignore'))

        return {
            'source': str(self),
            'star_sign_index': self.star_sign,
            'star_sign_name': self.STAR_SIGNS[self.star_sign][1],
            'date': doi.strftime('%Y-%m-%d'),
            'message': self._find_message_dom(tree.xpath(self.QUERY_SELECTOR)),
        }

    def __next__(self):
        return self.next()
