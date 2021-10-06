from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .init import db, app
from .models import Session, File, Result, Sequence

admin = Admin(app, name='Verwaltung', template_mode='bootstrap4')
admin.add_view(ModelView(Session, db.session))
admin.add_view(ModelView(File, db.session))
admin.add_view(ModelView(Result, db.session))
admin.add_view(ModelView(Sequence, db.session))



