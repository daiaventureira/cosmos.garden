from __future__ import unicode_literals
from base_spider import BaseSpider

from datetime import date

class SagittariusCom(BaseSpider):
    BASE_URL = 'https://sagittarius.com/archive/free-horoscope-{date_string}.php'
    QUERY_SELECTOR = '//ul[@class="horoscope-list"]//li//div[@class="text"]//p'

    FIRST_DATE = date(2009, 8, 15)
    LAST_DATE = date(2019, 10, 7)

    def get_url(self, ref_date):
        return self.BASE_URL.format(date_string=ref_date.strftime('%B-%d-%Y'))

    def _find_message_dom(self, dom):
        return dom[self.star_sign].text
