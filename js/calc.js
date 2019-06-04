function factors(n) {
    if (n === 1)
        return [];
    let res = Array(n + 1).fill(0);
    let p = 2;
    while (n >= p * p)
        if (n % p)
            p++;
        else {
            n /= p;
            res[p]++;
        }
    res[n]++;
    return res;
}
function mu(n) {
    // Count for any factor > 1 -> 0
    // Odd number of factors    -> -1
    // Even number of factors   -> 1
    let f = factors(n);
    return f.some((cur) => cur > 1) ? 0 : f.reduce((acc, cur) => acc + cur, 0) % 2 ? -1 : 1;
}
function calc(b, p) {
    // \frac{1}{p}\sum_{d|p}{\mu(\frac{p}{d})(b^d-(b-1)^d)} for exact ball
    if (p === 1)
        return Array(b).fill(1);
    let res = Array(b).fill(0);
    let ds = dividers(p);
    for (let d of ds)
        for (let i = 0; i < b; i++)
            res[i] += mu(p / d) * (Math.pow((i + 1), d) - Math.pow(i, d));
    return res.map((cur) => cur / p);
}
function calcShow(b, p, res, start) {
    let time = (Date.now() - start) / 1000;
    byId('calc-time').innerText = `${time} second${time === 1 ? '' : 's'}`;
    byId('calc-ball').innerText = b.toString();
    byId('calc-peri').innerText = p.toString();
    byId('calc-tot').innerText = res.reduce((acc, cur) => acc + cur, 0).toString();
    byId('calc-math').innerText = `\\(\\frac{1}{${p}}\\sum_{d|${p}}{\\mu(\\frac{${p}}{d})(${b}^d)}\\)`;
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'calc-math']);
    let text = '';
    for (let i = 0; i < res.length; i++)
        text += `  ${i + 1} ball${i ? 's' : ''}: ${res[i]} result${res[i] === 1 ? '' : 's'}\n`;
    let textE = byId('calc-res');
    textE.value = text.substring(0, text.length - 1);
    M.textareaAutoResize(textE);
    byId('calc-card').style.display = 'block';
}
function calcMain(b, p) {
    let start = Date.now();
    calcShow(b, p, calc(b, p), start);
}
