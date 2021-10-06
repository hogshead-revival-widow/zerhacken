from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from pathlib import Path
import stille_splitten.consts
import stille_splitten.settings
import stille_splitten.helper

SUCCESS = stille_splitten.consts.SUCCESS
NO_RESULT = stille_splitten.consts.NO_RESULT
UNWEIGHTED_RESULTS = stille_splitten.consts.UNWEIGHTED_RESULTS
MAX_TRIES = len(stille_splitten.settings.SETTINGS['ffmpeg_options'])

HAS_RESULT = 'has_result'
STILL_PROCESSING = 'still_processing'
NOT_STARTED = 'not_started'
ID_LENGTH = 32

VERSION = '0.0.9'

CLEAN_UP_DB_AFTER = 24
DELETE_LOG_AFTER = 24
DELETE_LOG_IF_BIGGER_THAN = 512000 #bytes

base_path = Path('')
db_path = base_path / 'db' / 'datenbank.db'
templates = base_path / 'templates'
static = base_path / 'static'

LOG_FILE = static / 'stille_splitten_log.txt'

app = Flask(__name__, template_folder=templates, static_folder=static)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{str(db_path)}?check_same_thread=False'
app.config['SECRET_KEY'] = ''
app.config['UPLOAD_FOLDER'] = base_path / 'upload'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


app.config["UPLOAD_ALLOWED_EXTENSIONS"] = ['mp3', 'mp2', 'wav', 'flac', 'ogg']
app.config["TEMPLATES_AUTO_RELOAD"] = True

""" Konfiguration: stille_splitten """
stille_splitten.settings.SETTINGS['log_file'] = LOG_FILE
stille_splitten.settings.SETTINGS['write_results_to_dir'] = False
stille_splitten.settings.SETTINGS['run_id'] = 'per_zerhacken'
stille_splitten.helper.setup_logger()


frontend_consts = dict(
        SUCCESS=stille_splitten.consts.SUCCESS,
        NO_RESULT=stille_splitten.consts.NO_RESULT,
        UNWEIGHTED_RESULTS=stille_splitten.consts.UNWEIGHTED_RESULTS,
        Z_VERSION=VERSION,
        S_VERSION=stille_splitten.consts.VERSION,
        MAX_TRIES=len(stille_splitten.settings.SETTINGS['ffmpeg_options']),
        ALLOWED_EXTENSIONS=str(app.config["UPLOAD_ALLOWED_EXTENSIONS"]),
        HAS_RESULT=HAS_RESULT,
        STILL_PROCESSING=STILL_PROCESSING,
        NOT_STARTED=NOT_STARTED)