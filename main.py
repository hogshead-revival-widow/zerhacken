from src.init import app
from src.admin import admin
from src.clean_up import clean_up
from src.endpoints.api import route_audio, route_download
from src.endpoints.api import route_session_search_status, route_session_new
from src.endpoints.api import route_file_search_results, route_file_search_status, route_file_search_start, route_file_upload
from src.endpoints.user import route_index

if __name__ == '__main__':
    app.run()
