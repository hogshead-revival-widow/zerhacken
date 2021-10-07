import uuid
from .consts import ID_LENGTH

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
    
