from __future__ import unicode_literals
from base_spider import BaseSpider

from datetime import date

class HoroscopeCom(BaseSpider):
    BASE_URL = 'https://www.horoscope.com/us/horoscopes/general/horoscope-archive.aspx?sign={star_sign}&laDate={date_string}'
    QUERY_SELECTOR = '//div[@class="main-horoscope"]//p[1]/text()'

    FIRST_DATE = date(2019, 5, 2)
    LAST_DATE = date.today()

    def get_url(self, ref_date):
        return self.BASE_URL.format(star_sign=self.star_sign + 1, date_string=ref_date.strftime('%Y%m%d'))

    def _find_message_dom(self, dom):
        return dom[0]
