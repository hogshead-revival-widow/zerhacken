import datetime
from .init import db
from .settings import LOG_FILE
from .settings import CLEAN_UP_AFTER, DELETE_LOG_AFTER, DELETE_LOG_BIGGER_THAN
from .models import Session


def clean_up():

    if LOG_FILE.is_file():
        log_mtime = LOG_FILE.stat().st_mtime
        log_modified = datetime.datetime.fromtimestamp(log_mtime)
        is_too_old = datetime.datetime.now(
        ) - log_modified > datetime.timedelta(hours=DELETE_LOG_AFTER)
        is_too_big = LOG_FILE.stat().st_size > DELETE_LOG_BIGGER_THAN
        if(is_too_old or is_too_big):
            LOG_FILE.unlink()

    too_old_sessions = Session.query.filter(Session.last_access <= (datetime.datetime.now(
        datetime.timezone.utc) - datetime.timedelta(hours=CLEAN_UP_AFTER))).all()

    if too_old_sessions is not None:
        for too_old_session in too_old_sessions:
            db.session.delete(too_old_session)
        db.session.commit()

