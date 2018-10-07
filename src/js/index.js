var m, w, b;

window.addEventListener("load", () => {
    // Display Main Body if JavaScript is Working
    dgebi("content").style.display = "inherit";

    // Check for WASM and WebWorkers Compatibility
    m = Boolean(undefined); // Unimplemented
    b = Boolean(window.Blob);
    w = b && Boolean(window.Worker);
    let methods = "";
    // if (m) {
    //     dgebi("wasm").innerHTML = "Your browser supports WebAssembly! Simulation would run faster than the alternative XD";
    //     methods += "<button id=\"mw\">WebAssembly</button>\n";
    // } else dgebi("wasm").innerHTML = "Your browser does not support WebAssembly! That\'s OK, just that the simulation will run slower :D";
    if (w) {
        dgebi("worker").innerHTML = "Your browser supports Web Workers! Your browser should not freeze during large simulations, though it may run mildly slower XD";
        methods += "<button id=\"nmw\">Web Worker</button>\n";
    } else dgebi("worker").innerHTML = "Your browser does not support Web Workers! That\'s OK, just that the browser may freeze during large simulations :D";
    if (methods.length) {
        dgebi("method").innerHTML = "You can choose different methods to use! Click on a method then the one you want to calculate! The default is always the first option :)";
        dgebi("methods").innerHTML = methods + "<button id=\"nmnw\">Loop</button>";
        // if (m) dgebi("mw").addEventListener("click", () => m = true);
        if (w) dgebi("nmw").addEventListener("click", () => [m, w] = [false, true]);
        dgebi("nmnw").addEventListener("click", () => m = w = false);
    }

    // Initiate Resizer
    resizer();

    // All the Clicks!
    dgebi("calc").addEventListener("click", prep);
    dgebi("exp").addEventListener("click", () => alert("Not exactly true but, ¯\\_(ツ)_/¯"))
    dgebi("meh").addEventListener("click", () => alert("Maybe I can optimize it but, ¯\\_(ツ)_/¯"));
    dgebi("nah").addEventListener("click", () => alert("Obviously it's not supported (」ﾟヘﾟ)」\nI could've made it compatible but, (´π`)"));
});
