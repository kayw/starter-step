# -*- coding: utf-8 -*-
from datetime import datetime, tzinfo, timedelta
ZERO = timedelta(0)

class FixedTimeZoneOffset(tzinfo):
    def __init__(self, name, offset):
        self.__name = name
        self.__offset = offset

    def utcoffset(self, dt):
        return self.__offset

    def dst(self, dt):
        return ZERO

    def tzname(self, dt):
        return self.__name
