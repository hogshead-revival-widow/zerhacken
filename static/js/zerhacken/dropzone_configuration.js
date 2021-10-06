function initDropzone(Dropzone) {
  var at_least_one_file_uploaded = false;
  var session_id = null;
  Dropzone.options.dropzoneSammelband = {
    autoProcessQueue: false,
    uploadMultiple: false,
    parallelUploads: 20,
    acceptedFiles:
      ALLOWED_EXTENSIONS.slice(0, -1).map((el) => "." + el + ", ") +
      "." +
      ALLOWED_EXTENSIONS[ALLOWED_EXTENSIONS.length - 1],
    maxFiles: 100,
    clickable: true,
    dictDefaultMessage: "Hier Dateien zum Upload hinziehen",
    dictFileTooBig:
      "Leider ist die Datei zu groß ({{filesize}}MiB). Maximal erlaubt sind: {{maxFilesize}}MiB.",
    dictInvalidFileType: `Leider kann diese Datei nicht hochgeladen werden. Erlaubte Dateitypen: ${ALLOWED_EXTENSIONS.join(", ")}.`,
    init: function () {
      let dropzoneSammelband = this;

      this.on("addedfiles", function (files) {
        if (session_id === null) {
          (async () => {
            const result = await call(api.getNewSession());
            return result.data.session_id;
          })().then((new_session_id) => {
            session_id = new_session_id;
            dropzoneSammelband.options.url =
              dropzoneSammelband.options.url + session_id;
            dropzoneSammelband.processQueue();
          });
        } else {
          dropzoneSammelband.processQueue();
        }
      });

      this.on("success", function (file, response) {
        at_least_one_file_uploaded = true;
        setProgressbar(5, (add = true), (max = 20));
      });

      this.on("queuecomplete", function (file, response) {
        if (at_least_one_file_uploaded) {
          showProceedButton(session_id, dropzoneSammelband);
        }
      });
    },
  };
}
