const triggerRenderingStatusChange = function (file_id, newFileStatus, total) {
    if (newFileStatus === HAS_RESULT) {
        incrementProgressbar(total);
        renderResultHeader(total);
        renderResult(file_id);
        if (Object.keys(fileResults).length === Object.keys(fileStatus).length) {
            setProgressbar(100);
            const loader = document.getElementById("results-loading-loader");
            loader.style.display = "none";
            if (Object.keys(fileStatus).length !== 1) {
                showExportAllLinks();
            }
        }
    }
};

const renderResultHeader = function (total, allDone = false) {
    headerCounter += 1;
    resultsHeader = document.getElementById("results-header");
    if (allDone === true || headerCounter >= total) {
        resultsHeader.innerText = "Fertig!";
    } else {
        resultsHeader.innerText = `Ergebnisse (${headerCounter}/${total})`;
    }
};

const showExportAllLinks = function () {
    const exportButtons = document.getElementById("results-export-all");
    exportButtons.style.display = "block";
};

const renderFileButtons = function (file_id) {
    const template = `
    <aside class="m-2">

    <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#results-item-sequenzen-${file_id}">
        <svg class="bi" width="19" height="19" fill="currentColor" role="img" aria-label="Exportieren als JSON:">
                            <use xlink:href="#sequenzen"></use>
        </svg>&nbsp;&nbsp;Sequenzen anzeigen
    </button>
    
    <div class="btn-group btn-group-sm" id="results-item-export-${file_id}">
            
            <a href="${urls.export_file.as_excel}${file_id}" class="btn btn-outline-primary" target="_blank">
                    <svg class="bi" width="19" height="19" fill="currentColor" role="img" aria-label="Exportieren als Excel:">
                        <use xlink:href="#export"></use>
                    </svg>&nbsp;Excel</a>
        
                <a href="${urls.export_file.as_json}${file_id}" class="btn btn-outline-primary">
                    <svg class="bi" width="19" height="19" fill="currentColor" role="img" aria-label="Exportieren als JSON:">
                        <use xlink:href="#export"></use>
                    </svg>&nbsp;JSON</a>                              
            </div>
    </aside>`;

    return template;
};

const renderSequences = function (file_id, result, countSequences) {
    var renderedSequences = `
    <table class="table table-hover table-sm">
    <thead>
        <tr>
            <th scope="col">Position</th>
            <th scope="col">Start</th>
            <th scope="col">Ende</th>
            <th scope="col">Dauer</th>
            <th scope="col">Reinhören</th>
        </tr>
    </thead>
    <tbody>`;

    result.sequences.forEach((sequence) => {
        renderedSequences += `
        <tr>
            <th scope="row">${sequence.position}</th>
            <td>${sequence.start}</td>
            <td>${sequence.end}</td>
            <td>${sequence.duration}</td>
            <td>
               <audio controls 
                    src="${urls.audio}${file_id}#t=${sequence.start},${
            sequence.end
        }"
                    preload="${
                        countSequences < DONT_PRELOAD_METADATA_IF_MORE_THAN
                            ? "metadata"
                            : "none"
                    }">
                </audio>

            </td>
        </tr>`;
    });

    renderedSequences += `</tbody></table>`;
    return renderedSequences;
};

const renderSequencesModal = function (file_id, properties) {
    const result = fileResults[file_id];
    const file_name = result.file_name;

    const renderedSequences = [];
    var info_player = "Hinweis: Mit dem Vorhör-Spieler lässt sich schnell in die Sequenz reinhören. Angezeigt wird zwar die Gesamtdauer, er hört aber automatisch auf, wenn das Sequenzende erreicht ist.";

    result.results.forEach((result) => {
        if (result.sequences.length > 0) {
            const newSequence = {
                sequences: renderSequences(
                    file_id,
                    result,
                    result.sequences.length
                ),
                count: result.sequences.length
            };
            renderedSequences.push(newSequence);
        }
        if (result.sequences.length > DONT_PRELOAD_METADATA_IF_MORE_THAN) {
            info_player = `Hinweis: Da recht viele Sequenzen gefunden wurden, werden die Metadaten des Files erst bei Bedarf nachgeladen. Daher zeigt der Player keinen Startwert an. Er beginnt trotzdem mit dem angezeigten Start-Timecode und hört mit dem Stop-Timecode auf.`;
        }
    });

    var modal = `
    <div class="modal fade" id="results-item-sequenzen-${file_id}" tabindex="-1" aria-labelledby=id="results-item-sequenzen-label-${file_id}" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-xl modal-fullscreen-lg-down">
    <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="results-item-sequenzen-label-${file_id}">Sequenzen: ${file_name}</h5>
      <h5>${properties.bullet}</h5>
    </div>
    <div class="modal-body">`;

    if (renderedSequences.length === 1) {
        modal += renderedSequences[0].sequences;
    } else if (renderedSequences.length > 1) {
        const multipleSequences = { navigation: "", content: "" };
        renderedSequences.forEach((sequences, index) => {
            multipleSequences.navigation = multipleSequences.navigation + `<button class="nav-link ${index === 0 ? "active" : ""}" id="table-button-${file_id}-${index}" data-bs-toggle="tab" data-bs-target="#table-sequences-${file_id}-${index}" type="button" role="tab" aria-controls="table-sequences-${file_id}-${index}" aria-selected="${index === 0 ? "true" : "false"}">Menge #${index + 1} (${sequences.count})</button>`;
            multipleSequences.content = multipleSequences.content + `<div class="tab-pane fade ${index === 0 ? "show active" : ""}" id="table-sequences-${file_id}-${index}" role="tabpanel" aria-labelledby="table-button-${file_id}-${index}">${sequences.sequences}</div>`;
        });
        modal += `
            <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    ${multipleSequences.navigation}
                </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
                ${multipleSequences.content}
            </div>`;
    }

    modal += `
        </div>
            <div class="modal-footer">
                <p><small><em>${info_player}</em></small></p>
                <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Schließen</button>
            </div>
            </div>
        </div>
    </div>`;

    return modal;
};



const renderResult = function (file_id) {
    const result = fileResults[file_id];
    const isFirstResult = Object.keys(fileResults).length === 1;

    const properties = renderResultProperties(result);

    var buttons = "";
    var sequencesModal = "";

    if (properties.plausibility !== NO_RESULT) {
        buttons = renderFileButtons(file_id);
        sequencesModal = renderSequencesModal(file_id, properties);
    }

    var buttonTitle = "";
    if (properties.sequenceCount.length > 0) {
        if(properties.sequenceCount.length === 1){
            buttonTitle = `
            <span>${properties.sequenceCount[0]} ${properties.sequenceCount[0]===1?"Sequenz":"Sequenzen"} in
            <em>${result.file_name}</em> gefunden</span>`;
        }else{
            buttonTitle = `
            <span>Mehrere mögliche Sequenzmengen in <em>${result.file_name}</em> gefunden</span>`;
        }
        
    }else{
        buttonTitle = `<span>Keine Sequenzen in <em>${result.file_name}</em> gefunden</span>`
    }

    var template = `
    <div class="accordion-item m-3" id="results-item-${file_id}">

        <h2 class="accordion-header position-relative" id="results-item-head-${file_id}">
            <button class="accordion-button ${isFirstResult ? "" : "collapsed"}" type="button" data-bs-toggle="collapse"
            data-bs-target="#results-item-body-${file_id}" aria-expanded="${isFirstResult ? "true" : "false"}"
            aria-controls="results-item-body-${file_id}">

            ${buttonTitle} ${properties.badge}
            
            </button>
            
        </h2>

        <div id="results-item-body-${file_id}" class="accordion-collapse collapse ${
            isFirstResult ? "show" : ""}"
            aria-labelledby="results-item-head" data-bs-parent="#results-parent">
            <div class="accordion-body position-relative" id="results-item-content-${file_id}">
            ${properties.text}

            ${buttons}
            </div>
        </div>

    </div>
    ${sequencesModal}`;

    parent = document.getElementById("results-parent");
    parent.insertAdjacentHTML("beforeend", template);
};

const _createProperties = function (plausibility, sequenceCount, template, text) {
    const badgeStyle = `position-absolute top-0 end-0 translate-middle`;
    const out = {};
    out.sequenceCount = sequenceCount;
    out.plausibility = plausibility;
    out.badge = template.replace("{badgeStyle}", badgeStyle);
    out.bullet = template.replace("{badgeStyle}", "");
    out.text = text;
    return out;
    
};

const renderResultProperties = function (result) {
    const plausibility = result.results[0].plausibility;
    var good = `<span class="badge bg-success text-light {badgeStyle}">eindeutig<span>`;
    var okay = `<span class="badge bg-success text-light {badgeStyle}">eindeutig</span>`;
    var bad = `<span class="badge bg-warning text-light {badgeStyle}">mehrdeutig</span>`;
    var horrible = `<span class="badge bg-danger text-light {badgeStyle}">kein Fund</span>`;

    const sequenceCount = [];
    result.results.forEach((result) => {
        if (result.sequences.length > 0) {
            sequenceCount.push(result.sequences.length);
        }
    });

    if (plausibility === SUCCESS) {
        const text = `Erwartungsgemäß <strong>${sequenceCount[0]}</strong> Sequenzen gefunden.`;
        const out = _createProperties(plausibility, sequenceCount, good, text);
        return out;
    }

    if (plausibility < SUCCESS && plausibility > UNWEIGHTED_RESULTS) {
        const text = `<strong>${sequenceCount[0]}</strong> Sequenzen gefunden. Diese Sequenzmenge wurde in ${plausibility} von ${MAX_TRIES} unabhängigen Durchläufen bestätigt.`;
        const out = _createProperties(plausibility, sequenceCount, okay, text);
        return out;
    }

    if (plausibility === UNWEIGHTED_RESULTS) {
        const text = `Unterschiedliche Sequenzmengen (${sequenceCount.join(', ')}) gefunden. Keine davon konnte mehr als einmal bestätigt werden.`;
        const out = _createProperties(plausibility, sequenceCount, bad, text);
        return out;
    }

    if (plausibility === NO_RESULT) {
        const text =
            "Für diese Datei wurden <strong>keine</strong> Sequenzen gefunden.";
        const out = _createProperties(plausibility, sequenceCount, horrible, text);
        return out;
    }
};
