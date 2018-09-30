var errors = [];

window.onerror = (msg, source, lineno, colno, error) => {
    let s = msg.toLowerCase();
    let ss = "script error";
    if (s.includes(ss)) {
        errors.push({
            msg: "Script Error"
        });
    }
    else {
        errors.push({
            msg: msg,
            source: source,
            line: lineno,
            coln: colno,
            error: JSON.stringify(error)
        });
    }
    showError();
};

document.addEventListener("error", (event) => {
    if (event.target && event.target.src) {
        errors.push({
            msg: "Resource not found",
            source: event.target.src
        });
    }
    else {
        errors.push({
            msg: "Unknown error",
            error: JSON.stringify(event)
        });
    }
    showError();
}, true);

function showError() {
    dgebi("error").innerHTML = "Calculation error! Please <a href=\"https://github.com/Mushinako/Find-Pattern/issues\">file an issue</a> with the log below! Much thanks!";
    dgebi("errors").style.display = "inherit";
    dgebi("errors").innerHTML = errors.length ? `${JSON.stringify(errors, null, 4)}` : "Unidentified error! Please explain how you get this error.";
}
