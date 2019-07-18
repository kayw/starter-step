# -*- coding: utf-8 -*-

class Conf(object):
    DEBUG = False
    TESTING = False
    DATABASE = 'blog.db'

class ProductionConf(Conf):
    pass

class DevelopmentConf(Conf):
    DEBUG = True
    USERNAME='kayw'
    PASSWORD=''
    TRAP_BAD_REQUEST_ERRORS=True
    SQLITE_SCHEMA = 'schema_sqlite.sql'
    SECRET_KEY = '\xe0\x80p|I\x0b\xd9\xff\x03\xc1\xff}\x95\x05\x96\x17\x1f\x06\xb1\xb3'

class TestConf(Conf):
    USERNAME='admin'
    PASSWORD=''
    TESTING = True
