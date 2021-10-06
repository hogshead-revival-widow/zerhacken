const call = async function (apiCall) {
    let response = await fetch(apiCall, { method: "POST" });
    if (response.ok && response.status === 200) {
        const result = await response.json();
        return result;
    } else {
        handleError(response);
    }
};

const triggerProcessing = async function (session_id) {
    const statusAll = await call(api.getStatusAll(session_id));
    statusAll.data.not_started.forEach((file_id) => {
        call(api.startSearch(file_id));
        setStatus(file_id, NOT_STARTED);
    });
};

const getResult = async function (file_id, total) {
    if (
        file_id in fileResults ||
        (file_id in fileStatus && fileStatus[file_id] === HAS_RESULT)
    ) {
        return null;
    }
    result = await call(api.getResult(file_id));
    fileResults[file_id] = result.data[file_id];
    setStatus(file_id, HAS_RESULT, total);
};

const setStatus = function (file_id, newFileStatus, total = 0) {
    if (ALLOWED_RESULT_STATUS.includes(newFileStatus)) {
        var statusHasChanged = false;

        if (
            !(file_id in fileStatus) ||
            (file_id in fileStatus && fileStatus[file_id] !== newFileStatus)
        ) {
            statusHasChanged = true;
        }

        fileStatus[file_id] = newFileStatus;

        if (statusHasChanged === true) {
            triggerRenderingStatusChange(file_id, newFileStatus, total);
        }
    } else {
        console.log("Unbekannter Status", file_id, newFileStatus);
    }
};

const monitorStatus = async function (session_id) {
    const statusAll = await call(api.getStatusAll(session_id));
    const total = parseInt(statusAll.data.total_files);
    statusAll.data.has_result.forEach((file_id) => getResult(file_id, total));
    if (
        gotFirstResult === false &&
        Object.keys(statusAll.data.has_result).length > 0
    ) {
        gotFirstResult = true;
        showStep(STEPS.results);
    }

    statusAll.data.still_processing.forEach((file_id) =>
        setStatus(file_id, STILL_PROCESSING, total)
    );
    statusAll.data.not_started.forEach((file_id) =>
        setStatus(file_id, NOT_STARTED, total)
    );
    if (
        typeof statusAll.data.all_done === "boolean" &&
        statusAll.data.all_done === false
    ) {
        setTimeout(monitorStatus.bind(null, session_id), POLL_INTERVAL);
    } else {
        if (gotFirstResult === false) {
            console.log("Fehler: api_interaction");
            showError("Kommunikation fehlgeschlagen.");
        }
    }
};
