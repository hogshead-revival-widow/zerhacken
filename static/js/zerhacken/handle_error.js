const showError = function (message) {
    Array.from(document.getElementById("fortschritt").children).map(function (c) {
        c.style.display = "none";
    });
    error_msg = document.getElementById("error-msg");
    document.getElementById("status").innerText = message;
    error_msg.style.display = "block";

    Array.from(document.getElementById("content").children).map(function (c) {
        c.style.display = "none";
    });

    const steps = document.getElementById("steps");
    steps.style.display = "none";

    const errorSection = document.getElementById("error");
    errorSection.style.display = "block";
};

const handleError = function (data) {
    showError(data.message);
};
