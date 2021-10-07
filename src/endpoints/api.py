import json
from pathlib import Path
from threading import Thread
from flask import jsonify, Response, send_from_directory, request
from ..init import app, db
from ..consts import HAS_RESULT, STILL_PROCESSING, NOT_STARTED
from ..models import Session, File
from ..upload import is_uploaded
from ..search_sequences import search_sequences
from ..helper import is_proper_id
from ..messages import *


@app.route('/audio/<string:file_id>', methods=['GET', 'POST'])
def route_audio(file_id):
    if not is_proper_id(file_id):
        return jsonify({'message': msg_malformatted}), 400

    file = File.from_id(file_id)
    if file is None:
        return jsonify({'message': msg_not_found}), 404

    path = Path(file.path)
    if not path.is_file:
        return jsonify({'message': msg_not_found}), 404
    return send_from_directory(path.parent, path.name)


@ app.route('/download/<string:level>/<string:export_method>/<string:level_id>', methods=['GET', 'POST'])
def route_download(level, level_id, export_method):
    if (level != 'file' and level != 'session') or \
            (export_method != 'as_json' and export_method != 'as_excel'):
        return jsonify({'message': msg_not_implemented}), 501
    if not is_proper_id(level_id):
        return jsonify({'message': msg_malformatted}), 400

    options = dict()
    if level == 'file':
        obj = File.from_id(level_id)
    if level == 'session':
        file_name = f'Ergebnisse-{level_id[:5]}'
        options['options'] = 'exclude_files_without_results'
        obj = Session.from_id(level_id)

    if obj is None:
        return jsonify({'message': msg_not_found}), 404

    if level == 'file':
        file_name = obj.name[:25]

    if export_method == 'as_json':
        as_json = obj.serialize(**options)
        return Response(json.dumps(as_json, indent=4),
                        mimetype='application/json',
                        headers={'Content-Disposition': f'attachment;filename={file_name}.json'})

    as_excel = obj.as_excel(**options)
    return Response(as_excel, headers={
        'Content-Disposition': f'attachment; filename={file_name}.xlsx',
        'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})


@ app.route('/api/session/search/status/<string:session_id>', methods=['POST'])
def route_session_search_status(session_id):
    if not is_proper_id(session_id):
        return jsonify({'message': msg_malformatted}), 400

    session = Session.from_id(session_id)

    if session is None:
        return jsonify({'message': msg_not_found}), 404

    status_result, status_processing, status_not_started, total_files, all_done = session.get_status_all_files()

    data = {
        HAS_RESULT: status_result,
        STILL_PROCESSING: status_processing,
        NOT_STARTED: status_not_started,
        'total_files': total_files,
        'all_done': all_done
    }
    return jsonify({'message': msg_results_success, 'data': data}), 200


@ app.route('/api/file/search/results/<string:file_id>', methods=['POST'])
def route_file_search_results(file_id):
    if not is_proper_id(file_id):
        return jsonify({'message': msg_malformatted}), 400

    file = File.from_id(file_id)

    if file is None:
        return jsonify({'message': msg_not_found}), 404

    if len(file.results) < 1:
        return jsonify({'message': msg_results_none}), 404

    data = file.serialize()
    return jsonify({'message': msg_results_success, 'data': data}), 200

# /api/file/search/status/383ABAA9..: data: status: done/started/not_started

@ app.route('/api/file/search/status/<string:file_id>', methods=['POST'])
def route_file_search_status(file_id):
    if not is_proper_id(file_id):
        return jsonify({'message': msg_malformatted}), 400

    file = File.from_id(file_id)

    if file is None:
        return jsonify({'message': msg_not_found}), 404

    if len(file.results) > 0:
        return jsonify({'message': msg_status_done, 'data': {'status': 'done'}}), 200
    if file.is_unprocessed == False:
        return jsonify({'message': msg_status_processing, 'data': {'status': 'started'}}), 200

    return jsonify({'message': msg_status_not_started, 'data': {'status': 'not_started'}}), 202


# /api/file/search/start/383ABAA9..
@ app.route('/api/file/search/start/<string:file_id>', methods=['POST'])
def route_file_search_start(file_id):
    if not is_proper_id(file_id):
        return jsonify({'message': msg_malformatted}), 400

    file = File.from_id(file_id)

    if file is None:
        return jsonify({'message': msg_not_found}), 404

    if not file.is_unprocessed:
        return jsonify({'message': msg_analyse_already_started}), 409

    file.is_unprocessed = False
    db.session.add(file)
    db.session.commit()

    thread = Thread(target=search_sequences, kwargs={'file_id': file_id})
    thread.start()

    return jsonify({'message': msg_analyse_started}), 200


@ app.route('/api/file/upload/<string:session_id>', methods=['POST'])
def route_file_upload(session_id):

    if not is_proper_id(session_id):
        return jsonify({'message': msg_malformatted}), 400

    session = Session.from_id(session_id)

    if session is None:
        return jsonify({'message': msg_not_found}), 404

    successful, returned = is_uploaded(session, request)
    if successful:
        data = returned
        return jsonify({'message': msg_upload_ok, 'data': data}), 200

    if returned == 400:
        return jsonify({'error': msg_upload_invalid_type, 'code': 400})

    if returned == 501:
        return jsonify({'message': msg_not_implemented}), 501

    return jsonify({'message': msg_not_found}), 404


# /api/session/new
@ app.route('/api/session/new', methods=['POST'])
def route_session_new():
    session = Session()
    db.session.add(session)
    db.session.commit()
    data = dict(session_id=session.id)
    return jsonify({'messsage': msg_session_new, 'data': data}), 200
