import uuid
from .init import ID_LENGTH

def get_uuid():
    return uuid.uuid4().hex


def is_proper_id(value):
    if not isinstance(value, str):
        return False
    if len(value) != ID_LENGTH:
        return False
    try:
        int(value, 16)
    except ValueError:
        return False
    return True


def clean_up(session_id):
    #todo: aktivieren
    print("wegen ausprobierne zur zeit deaktiv")
    #to_delete = app.config['UPLOAD_FOLDER'] / session_id
    #if to_delete.is_dir():
    #    shutil.rmtree(to_delete)

    