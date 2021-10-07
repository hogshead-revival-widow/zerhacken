from pathlib import Path

DIR_BASE = Path('')
DIR_DB = DIR_BASE / 'db' / 'datenbank.db'
DIR_TEMPLATES = DIR_BASE / 'templates'
DIR_STATIC = DIR_BASE / 'static'
DIR_UPLOAD = DIR_BASE / 'upload'

ALLOWED_EXTENSIONS = ['mp3', 'mp2', 'wav', 'flac', 'ogg']
LOG_FILE = DIR_STATIC / 'stille_splitten_log.txt'

# clean up
CLEAN_UP_AFTER = 1  # deletes db entries and files older than CLEAN_UP_AFTER hrs
DELETE_LOG_AFTER = 24
DELETE_LOG_BIGGER_THAN = 512000  # bytes
