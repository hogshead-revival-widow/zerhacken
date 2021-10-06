from flask import render_template
from ..init import app, frontend_consts
from ..clean_up import clean_up

@ app.route('/')
@ app.route('/zerhacken')
def route_index():
    clean_up()
    return render_template('index.html', consts=frontend_consts)

