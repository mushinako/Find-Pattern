var worker;
var ball, period;
var bs;

// Check Singular/Plural
// Yeah I'm Perfectionist What's the Problem
var plrl = n => n === 1 ? "" : "s";

// Preparations for Calculations
function prep(jugg) {
    // Sanitize Inputs
    let san_ball = sanitize(dgebi("ball").value);
    let san_period = sanitize(dgebi("period").value);
    if (san_ball[0] && san_period[0]) {
        ball = san_ball[1];
        period = san_period[1];
        if (ball > 0 && period > 0) {
            // Clear Outputs (Refilled in showCalc and showToss)
            if (dgebi("download")) dgebi("download").removeEventListener("click", () => dn("results", "juggle"));
            dgebi("results").style.display = "none";
            let clear = ["quest", "calcerror", "calctime", "predict", "tosserror", "tosstime", "total", "results", "download", "error", "errors"];
            for (let x of clear) dgebi(x).innerHTML = "";
            // Disable Inputs (Reenabled in mainToss and showToss)
            for (let b of dgebtn("button")) b.disabled = true;
            for (let i of dgebtn("input")) i.disabled = true;
            // Calculation Indicator (Changed in showToss)
            bs = plrl(ball);
            dgebi("quest").innerHTML = `Tossing with a maximum of ${ball} ball${bs} with a period of ${period}...`;
            // Calculation
            mainCalc(!jugg);
            // Simulation
            if (jugg) mainToss();
        } else {
            let errornum = "";
            if (ball <= 0) errornum += "At least 1 ball is needed! ";
            if (period <= 0) errornum += "At least 1 period is needed! ";
            alert(errornum);
        }
    } else {
        let errornum = "";
        if (!san_ball[0]) errornum += "Number format error for balls! ";
        if (!san_period[0]) errornum += "Number format error for periods! ";
        alert(errornum);
    }
}

// Sanitize Inputs
function sanitize(input) {
    let e_input = input.split(/e/i);
    if (e_input.length === 1) if (/^\d+\.?\d*$/g.test(e_input[0])) return [true, Math.ceil(+e_input[0])];
    else if (e_input.length === 2 && /^[0-9]+$/g.test(e_input[1]) && /^\d+\.?\d*$/g.test(e_input[0])) return [true, Math.ceil(+e_input[0] * Math.pow(10, +e_input[1]))];
    return [false, 0];
}

// Calculations
function mainCalc(no_jugg) {
    let start = Date.now();
    // WASM, Unimplemented
    if (m) dgebi("calcerror").innerHTML = "You hack :/";
    // Worker
    else if (w) wk(factor + divider + mu + calc + `postMessage(calc(${ball},${period}))`, start, "calc", no_jugg);
    // Loop
    else showCalc(...calc(ball, period), start, no_jugg);
}

function showCalc(sum, sums, start, no_jugg) {
    let end = Date.now();
    dgebi("calctime").innerHTML = `Calculation took ${end - start} milliseconds`;
    dgebi("predict").innerHTML = `There should be \\(\\frac{1}{${period}}\\sum_{d|${period}}{\\mu(\\frac{${period}}{d})(${ball}^d)}\\)=${sum} different tosses with a max of ${ball} ball`;
    for (let i = 0; i < sums.length; i++) if (sums[i]) dgebi("predict").innerHTML += `<br>&emsp;${i+1} ball${plrl(i+1)}: ${sums[i]} result${plrl(sums[i])}`;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    if (no_jugg) {
        for (let b of dgebtn("button")) b.disabled = false;
        for (let i of dgebtn("input")) i.disabled = false;
    }
}

// Simulations
function mainToss() {
    let start = Date.now();
    // WASM, Unimplemented
    if (m) {
        dgebi("tosserror").innerHTML = "You hack :/";
        dgebi("quest").innerHTML = "You hack :/";
        for (let b of dgebtn("button")) b.disabled = false;
        for (let i of dgebtn("input")) i.disabled = false;
    }
    // Worker
    else if (w) wk(Toss + sameNumberArray + juggle + filterByPeriod + filterRotationaryDuplicates + sortBySiteswap + groupByBall + toss + `postMessage(toss(${ball},${period}))`, start, "toss", false);
    // Loop
    else showToss(...toss(ball, period), start);
}

function showToss(p_arr, total, no_error, error, start) {
    let end = Date.now();
    if (no_error) {
        dgebi("tosstime").innerHTML = `Tossing took ${end - start} milliseconds`;
        dgebi("total").innerHTML = `Actual: ${total} answers total`;
        dgebi("results").style.display = "inherit";
        for (let [b, tosses] of Object.entries(p_arr)) {
            dgebi("results").innerHTML += `${b} ball${plrl(+b)}: ${tosses.length} result${plrl(tosses.length)}\n`;
            for (let x of tosses) dgebi("results").innerHTML += `${x.siteswap}\n`;
            dgebi("results").innerHTML += "\n";
        }
        if (b) {
            dgebi("download").innerHTML = "<button id=\"dn\">Download Results</button>";
            dgebi("dn").addEventListener("click", () => dn("results", "juggle_results.txt"));
        }
        else dgebi("download").innerHTML = "<button id=\"dn\">No Blob, No File</button>";
        dgebi("quest").innerHTML = "Tossing finished!";
        for (let b of dgebtn("button")) b.disabled = false;
        for (let i of dgebtn("input")) i.disabled = false;
        if (!b) dgebi("dn").disabled = true;
    } else {
        dgebi("tosserror").innerHTML = "Calculation error!";
        dgebi("quest").innerHTML = "Tossing error!";
        for (let b of dgebtn("button")) b.disabled = false;
        for (let i of dgebtn("input")) i.disabled = false;
        throw new Error(error)
    }
}

// Worker
function wk(code, start, func, no_jugg) {
    let blob = new Blob([code], {type: "application/javascript"});;
    worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = message => {
        if (func === "toss") showToss(...message.data, start);
        else if (func === "calc") showCalc(...message.data, start, no_jugg);
        else throw new RangeError("Invalid Worker function!");
    }
}

// Downloader Using FileSaver.js by Eli Grey
function dn(source, name) {
    let data = dgebi(source).innerHTML.replace(/\n/g, "\r\n");
    let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, name);
}
