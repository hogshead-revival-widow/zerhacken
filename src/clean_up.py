import datetime
import shutil
from .init import db
from .init import LOG_FILE, CLEAN_UP_DB_AFTER, DELETE_LOG_AFTER, DELETE_LOG_IF_BIGGER_THAN
from .models import Session, File, Result, Sequence
from .helper import is_proper_id
from pathlib import Path


def clean_up():
    
    if LOG_FILE.is_file():
        log_mtime = LOG_FILE.stat().st_mtime
        log_modified = datetime.datetime.fromtimestamp(log_mtime)
        is_too_old = datetime.datetime.now() - log_modified > datetime.timedelta(hours=DELETE_LOG_AFTER)
        is_too_big = LOG_FILE.stat().st_size > DELETE_LOG_IF_BIGGER_THAN
        if(is_too_old or is_too_big):
            LOG_FILE.unlink()
        
    items_to_clean = list() 
    tables_to_clean = [Session, File, Result, Sequence]
    for table in tables_to_clean:
        items_to_clean.append(table.query.filter(table.last_access <= (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=CLEAN_UP_DB_AFTER))).all())

    if len(items_to_clean) > 0:
        for query_result in items_to_clean:
            for item in query_result:
                if isinstance(item, File):
                    path = Path(item.path).parent.parent
                    if path.is_dir() and is_proper_id(path.name):
                        shutil.rmtree(path)
                db.session.delete(item)
        db.session.commit()



