# -*- coding: utf-8 -*-
from flask import render_template
from flask.views import View,MethodView
from klog import app

class LinkView(MethodView):
    def get(self, link_name):
        pass
    def post(self):
        #request.form
        pass
    def delete(self, link_name):
        pass

class TemplateRenderView(View):
    def __init__(self, template_name, template_title):
        self.template_ = template_name
        self.title_ = template_title
    
    def dispatch_request(self):
        page = dict()
        page['title'] = self.title_
        return render_template(self.template_, page=page)

app.add_url_rule('/play', view_func=TemplateRenderView.as_view('playground', template_name='playground.html', template_title='play'))
app.add_url_rule('/saviour', view_func=TemplateRenderView.as_view('saviour', template_name='saviour.html', template_title='saviour'))
