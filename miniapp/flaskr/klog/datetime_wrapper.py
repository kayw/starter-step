#!/usr/bin/env python
# encoding: utf-8
from klog import app
import datetime
@app.context_processor
def my_utility_processor():

    def date_now(format="%d.m.%Y %H:%M:%S"):
        """ returns the formated datetime """
        return datetime.datetime.now().strftime(format)

    def foo():
        """ returns bulshit """
        return "bar bar bar"

    return dict(date_now=date_now, baz=foo)
