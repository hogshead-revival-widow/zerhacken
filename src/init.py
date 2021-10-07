from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import stille_splitten.helper
from .settings import DIR_TEMPLATES, DIR_DB, DIR_UPLOAD, DIR_STATIC, LOG_FILE
from .settings import ALLOWED_EXTENSIONS

app = Flask(__name__, template_folder=DIR_TEMPLATES, static_folder=DIR_STATIC)
app.config['SECRET_KEY'] = ''
app.config["TEMPLATES_AUTO_RELOAD"] = False

app.config["UPLOAD_ALLOWED_EXTENSIONS"] = ALLOWED_EXTENSIONS
app.config['UPLOAD_FOLDER'] = DIR_UPLOAD

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{str(DIR_DB)}?check_same_thread=False'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

stille_splitten.settings.SETTINGS['log_file'] = LOG_FILE
stille_splitten.settings.SETTINGS['write_results_to_dir'] = False
stille_splitten.settings.SETTINGS['run_id'] = 'per_zerhacken'
stille_splitten.helper.setup_logger()
