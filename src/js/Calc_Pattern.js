function factor(n) {
    if (n === 1)
        return {};
    let res = {};
    let i = 2;
    whole_loop: while (n > i) {
        for (;; i++) {
            if (!(n % i)) {
                n /= i;
                if (res[i] === undefined) {
                    res[i] = 1;
                }
                else {
                    res[i]++;
                }
                break;
            }
            if (i >= Math.floor(Math.sqrt(n)))
                break whole_loop;
        }
    }
    if (res[n] === undefined) {
        res[n] = 1;
    }
    else {
        res[n]++;
    }
    return res;
}
function divider(n) {
    if (n === 1)
        return [];
    let f = factor(n);
    let count = 1;
    let nums = [];
    let occs = [];
    for (let [num, occ] of Object.entries(f)) {
        nums.push(+num);
        occs.push(occ + 1);
        count *= occ + 1;
    }
    let res = [];
    for (let i = 0; i < count; i++) {
        let conf = 1;
        let c = i;
        for (let j = 0; j < occs.length; j++) {
            conf *= Math.pow(nums[j], c % occs[j]);
            c = Math.floor(c / occs[j]);
        }
        res.push(conf);
    }
    res.sort((a, b) => a - b);
    return res;
}
function mu(n) {
    let f = Object.entries(factor(n));
    return f.some(cur => cur[1] > 1) ? 0 : f.length % 2 ? -1 : 1;
}
function calc(b, p) {
    // \frac{1}{p}\sum_{d|p}{\mu(\frac{p}{d})(b^d-(b-1)^d)} for exact ball
    // \frac{b^d}{p}\sum_{d|p}{\mu(\frac{p}{d})} for max ball
    if (p === 1)
        return [b, Array(b).fill(1)];
    let sum = 0;
    let sums = Array(b).fill(0);
    let dividers = divider(p);
    for (let x of dividers) {
        let m = mu(p / x);
        if (m) {
            sum += m * Math.pow(b, x);
            for (let i = 0; i < b; i++)
                sums[i] += m * (Math.pow(i + 1, x) - Math.pow(i, x));
        }
    }
    return [sum / p, sums.map(cur => cur / p)];
}
