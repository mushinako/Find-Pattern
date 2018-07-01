interface Errors {
    msg: string,
    source?: string,
    line?: number,
    coln?: number,
    error?: string
}

var errors: Array<Errors> = [];

window.onerror = (msg: string, source: string, lineno: number, colno: number, error: Error): void => {
    let s = msg.toLowerCase();
    let ss = "script error";
    if (s.includes(ss)) {
        errors.push({
            msg: "Script Error"
        });
    } else {
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

document.addEventListener("error", (event: ErrorEvent) => {
    if (event.target && (event.target as any).src) {
        errors.push({
            msg: "Resource not found",
            source: (event.target as any).src
        });
    } else {
        errors.push({
            msg: "Unknown error",
            error: JSON.stringify(event)
        });
    }
    showError();
}, true);

function showError(): void {
    document.getElementById("error").innerHTML = "Calculation error! Please <a href=\"https://github.com/Mushinako/Find-Pattern/issues\">file an issue</a> with the log below! Much thanks!"
    document.getElementById("errors").innerHTML = `${errors}`;
}
