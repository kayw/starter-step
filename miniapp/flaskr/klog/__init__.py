# -*- coding: utf-8 -*-
from flask import Flask
app = Flask(__name__)
app.config.from_object('klog.conf.DevelopmentConf')
import datetime_wrapper
import views
import link_views
