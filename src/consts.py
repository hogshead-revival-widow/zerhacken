import stille_splitten.consts
import stille_splitten.settings
from .settings import ALLOWED_EXTENSIONS

SUCCESS = stille_splitten.consts.SUCCESS
NO_RESULT = stille_splitten.consts.NO_RESULT
UNWEIGHTED_RESULTS = stille_splitten.consts.UNWEIGHTED_RESULTS
MAX_TRIES = len(stille_splitten.settings.SETTINGS['ffmpeg_options'])

HAS_RESULT = 'has_result'
STILL_PROCESSING = 'still_processing'
NOT_STARTED = 'not_started'

ID_LENGTH = 32
VERSION = '0.0.9'

EXPORT_FRONTEND = dict(
    SUCCESS=SUCCESS,
    NO_RESULT=NO_RESULT,
    UNWEIGHTED_RESULTS=UNWEIGHTED_RESULTS,
    Z_VERSION=VERSION,
    S_VERSION=stille_splitten.consts.VERSION,
    MAX_TRIES=MAX_TRIES,
    ALLOWED_EXTENSIONS=str(ALLOWED_EXTENSIONS),
    HAS_RESULT=HAS_RESULT,
    STILL_PROCESSING=STILL_PROCESSING,
    NOT_STARTED=NOT_STARTED)
