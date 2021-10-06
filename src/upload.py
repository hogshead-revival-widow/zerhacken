from pathlib import Path
from werkzeug.utils import secure_filename
from .init import app, db
from .models import File
from .helper import get_uuid

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config["UPLOAD_ALLOWED_EXTENSIONS"]

def is_uploaded(session, request):
    if request is None or len(request.files) == 0:
        return False, 404
    if len(request.files) > 1:
        return False, 501

    for file in request.files:
        file = request.files[file]

        if not allowed_file(file.filename):
            return False, 400

        file_id = get_uuid()
        path = app.config['UPLOAD_FOLDER'] / session.id / \
            file_id / secure_filename(file.filename)
        uploaded_file = File(
            id=file_id, name=file.filename, path=path, session=session)

        Path(uploaded_file.path).parent.mkdir(parents=True, exist_ok=True)

        file.save(uploaded_file.path)

        db.session.add(uploaded_file)
        db.session.commit()

        data = dict(
            session_id=session.id,
            uploaded_file=uploaded_file.id
        )

        return True, data
