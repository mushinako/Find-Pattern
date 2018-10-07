window.onerror = (msg, source, lineno, colno, error) => {
    let s = msg.toLowerCase();
    let ss = "script error";
    errors.push(s.includes(ss) ? {
        msg: "Script Error"
    } : {
        msg: msg,
        source: source,
        line: lineno,
        coln: colno,
        error: JSON.stringify(error)
    });
    showError();
};

document.addEventListener("error", (event) => {
    errors.push(event.target && event.target.src ? {
        msg: "Resource not found",
        source: event.target.src
    } : {
        msg: "Unknown error",
        error: JSON.stringify(event)
    });
    showError();
}, true);

function showError() {
    dgebi("error").innerHTML = "Calculation error! Please <a href=\"https://github.com/Mushinako/Find-Pattern/issues\">file an issue</a> with the log below! Much thanks!";
    dgebi("errors").style.display = "inherit";
    dgebi("errors").innerHTML = errors.length ? `${JSON.stringify(errors, null, 4)}` : "Unidentified error! Please explain how you get this error.";
}
