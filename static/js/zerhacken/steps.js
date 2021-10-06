const STEPS = {
    upload: {
        title: "Zerhacken",
        showSection: "upload",
        activeStep: "step-upload",
        init: function () {
            setProgressbar(PROGRESS_START_VALUE);
            initDropzone(Dropzone);
        }
    },
    processing: {
        title: "Zerhacke...",
        showSection: "processing",
        activeStep: "step-processing",
        progressTo: 25,
        init: function (session_id) {
            setProgressbar(this.progressTo);
            const activity = document.getElementById("activity");
            activity.style.display = "block";
            triggerProcessing(session_id);
            monitorStatus(session_id);
            attachSessionID(session_id);
        }
    },
    results: {
        title: "Zerhacktes",
        showSection: "results",
        activeStep: "step-results",
        resultsParent: "results-parent",
        init: function () {
            const activity = document.getElementById("activity");
            activity.style.display = "none";
        }
    }
};
