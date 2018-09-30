var m, w;

window.addEventListener("load", () => {
    dgebi("content").style.display = "inherit";
    m = Boolean(undefined); // Unimplemented
    w = Boolean(window.Worker);
    let methods = "";
    // if (m) {
    //     dgebi("wasm").innerHTML = "Your browser supports WebAssembly! Simulation would run faster than the alternative XD";
    //     methods += "<button id=\"mw\">WebAssembly</button>\n";
    // } else {
    //     dgebi("wasm").innerHTML = "Your browser does not support WebAssembly! That\'s OK, just that the simulation will run slower :D";
    // }
    if (w) {
        dgebi("worker").innerHTML = "Your browser supports Web Workers! Your browser should not freeze during large simulations XD";
        methods += "<button id=\"nmw\">Web Worker</button>\n";
    } else {
        dgebi("worker").innerHTML = "Your browser does not support Web Workers! That\'s OK, just that the browser may freeze during large simulations :D";
    }
    if (methods.length) {
        dgebi("method").innerHTML = "You can choose different methods to use! Click on a method then the one you want to calculate!";
        dgebi("methods").innerHTML = methods + "<button id=\"nmnw\">Loop</button>";
        // if (m) dgebi("mw").addEventListener("click", () => m = true);
        if (w) dgebi("nmw").addEventListener("click", () => [m, w] = [false, true]);
        dgebi("nmnw").addEventListener("click", () => m = w = false);
    }
    resizer();
    dgebi("calc").addEventListener("click", main);
    dgebi("meh").addEventListener("click", () => dgebi("nah").style.display = "inherit");
});
