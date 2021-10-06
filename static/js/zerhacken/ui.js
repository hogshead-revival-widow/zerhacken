const setProgressbar = function (value, add = false, max = 100) {
    const progressbar = document.getElementById("progressbar");
    const old_value = parseFloat(progressbar.getAttribute("aria-valuenow"));
    if (old_value === 100) {
        return null;
    }
    if (add === true) {
        const new_value = old_value + parseFloat(value);
        if (new_value > max) {
            return setProgressbar(max);
        }
        return setProgressbar(new_value);
    } else {
        progressbar.style.width = `${value}%`;
        progressbar.setAttribute("aria-valuenow", value);
        if (value >= 100) {
            progressbar.innerText = "100%";
        }
    }
};

const incrementProgressbar = function (total) {
    if (total === 0) {
        return null;
    }
    const totalToProgress = 100 - STEPS.processing["progressTo"];
    const increment = Math.ceil(parseFloat(totalToProgress / total));
    setProgressbar(parseInt(increment), (add = true), (max = 90));
};

const showProceedButton = function (session_id, dropzoneSammelband) {
    if (!showProceedButtonHasBeenTriggered) {
        showProceedButtonHasBeenTriggered = true;
        button = document.getElementById("dropzoneSammelbandSubmit");
        button.parentNode.style.display = "block";
        button.addEventListener("click", function (element) {
            element.preventDefault();
            dropzoneSammelband.disable();
            showStep(STEPS.processing, [session_id]);
        });
    }
};

const attachSessionID = function (session_id) {
    const mail = document.getElementById("contact-mail");
    mail.href = `${mail.href}[Lauf: ${session_id}]`;

    const id_field = `
    <div class="mt-2">
        <label for="kolophon-session-id" class="form-label">UUID</label>
        <input class="form-control" id="kolophon-session-id" type="text" value="${session_id}" aria-label="readonly input" readonly>
    </div>`;

    const kolophon = document.getElementById("kolophon");
    kolophon.innerHTML = kolophon.innerHTML + id_field;

    exportButtons = document.getElementById("results-export-all");
    Array.from(exportButtons.children).map(function (c) {
        c.href = c.href + session_id;
    });
};

const showStep = function (step, args = []) {
    step.init(...args);
    Array.from(document.getElementById("content").children).map(function (c) {
        c.style.display = "none";
    });
    section = document.getElementById(step.showSection);
    section.style.display = "block";
    if (step.activeStep !== null) {
        Array.from(document.getElementById("steps").children).map(function (c) {
            c.classList.remove("active");
        });
        document.getElementById(step.activeStep).classList.add("active");
    }
    document.title = step.title;
};
