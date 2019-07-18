# -*- coding: utf-8 -*-
from klog import app
if app.config['DEBUG'] == True:
    #import db_sqlite
    from db_sqlite import *
else:
    None
