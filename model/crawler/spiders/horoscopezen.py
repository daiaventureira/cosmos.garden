from __future__ import unicode_literals
from base_spider import BaseSpider

from datetime import date

# Please check back very soon, we are performing maintenance on the website and will have the information back shortly

class HoroscopeZen(BaseSpider):
    BASE_URL = 'http://horoscope.horoscopezen.com/gethoroscope.asp?day={day}&month={month}&year={year}&sign={star_sign}'
    QUERY_SELECTOR = '//font//b'

    FIRST_DATE = date(2006, 1, 1)
    LAST_DATE = date.today()

    def get_url(self, ref_date):
        return self.BASE_URL.format(
            day=ref_date.day,
            month=ref_date.month,
            year=ref_date.year,
            star_sign=self.star_sign + 1
        )

    def _find_message_dom(self, dom):
        return dom[0].text
