var worker;
var ball, period;
var bs;

var plrl = n => n === 1 ? "" : "s";

function main() {
    if (dgebi("download")) dgebi("download").removeEventListener("click", () => dn("results", "juggle"));
    dgebi("results").style.display = "none";
    let clear = ["quest", "calctime", "predict", "tosstime", "total", "results", "download", "error", "errors"];
    for (let x of clear) dgebi(x).innerHTML = "";
    let san_ball = sanitize(dgebi("ball").value);
    let san_period = sanitize(dgebi("period").value);
    if (san_ball[0] && san_period[0]) {
        ball = san_ball[1];
        period = san_period[1];
        if (ball > 0 && period > 0) {
            for (let b of dgebtn("button")) b.disabled = true;
            for (let i of dgebtn("input")) i.disabled = true;
            bs = plrl(ball);
            dgebi("quest").innerHTML = `Tossing with a maximum of ${ball} ball${bs} with a period of ${period}`;
            mainCalc();
            mainToss();
            for (let b of dgebtn("button")) b.disabled = false;
            for (let i of dgebtn("input")) i.disabled = false;
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

function sanitize(input) {
    let e_input = input.split(/e/i);
    if (e_input.length === 1) if (/^\d+\.?\d*$/g.test(e_input[0])) return [true, Math.ceil(+e_input[0])];
    else if (e_input.length === 2 && /^[0-9]+$/g.test(e_input[1]) && /^\d+\.?\d*$/g.test(e_input[0])) return [true, Math.ceil(+e_input[0] * Math.pow(10, +e_input[1]))];
    return [false, 0];
}

function mainCalc() {
    let start = Date.now();
    if (m) dgebi("calcerror").innerHTML = "Damn you hack :/";
    else if (w) wk(factor + divider + mu + calc + `var b=${ball},p=${period};postMessage(calc(b,p))`, start, "calc");
    else showCalc(...calc(ball, period), start);
}

function showCalc(sum, sums, start) {
    let end = Date.now();
    dgebi("calctime").innerHTML = `Calculation took ${end - start} milliseconds`;
    dgebi("predict").innerHTML = `There should be \\(\\frac{1}{${period}}\\sum_{d|${period}}{\\mu(\\frac{${period}}{d})(${ball}^d)}\\)=${sum} different tosses with a max of ${ball} ball`;
    for (let i = 0; i < sums.length; i++) if (sums[i]) dgebi("predict").innerHTML += `<br>&emsp;${i+1} ball${plrl(i+1)}: ${sums[i]} result${plrl(sums[i])}`;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function mainToss() {
    let start = Date.now();
    if (m) dgebi("tosserror").innerHTML = "Damn you hack :/";
    else if (w) wk(Toss + sameNumberArray + juggle + filterByPeriod + filterRotationaryDuplicates + sortBySiteswap + groupByBall + toss + `var b=${ball},p=${period};postMessage(toss(b,p))`, start, "toss");
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
        if (Boolean(Blob)) {
            dgebi("download").innerHTML = "<button id=\"dn\">Download results</button>";
            dgebi("dn").addEventListener("click", () => dn("results", "juggle"));
        }
    } else {
        dgebi("tosserror").innerHTML = `Calculation error!\n${error}\nPlease <a href=\"https://github.com/Mushinako/Find-Pattern/issues\">file an issue</a>! Much thanks!`;
    }
}

function wk(code, start, func) {
    let blob = new Blob([code], {type: "application/javascript"});;
    worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = message => {
        if (func === "toss") showToss(...message.data, start);
        else if (func === "calc") showCalc(...message.data, start);
        else throw new RangeError("Invalid Worker function!");
    }
}

function dn(source, name) {
    let data = dgebi(source).innerHTML.replace(/\n/g, "\r\n");
    let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "${name}.txt");
}
