class Toss {
    constructor(arr) {
        this.stack = arr;
        this.maxball = Math.max(...this.stack);
        this.siteswap = this.stack2Siteswap();
        this.ss_length = this.siteswap.length;
    }
    stack2Siteswap() {
        var tbs = [];
        for (let i = 0; i < this.maxball; i++) {
            tbs.push(i);
        }
        var tbso = tbs.slice(0);
        var hand = [];
        do {
            for (let x of this.stack) {
                let in_hand = tbs.shift();
                hand.push(in_hand);
                tbs.splice(x - 1, 0, in_hand);
            }
        } while (!sameNumberArray(tbs, tbso));
        var ss = [];
        var l = hand.length;
        for (let i = l - 1; i >= 0; i--) {
            let found = false;
            for (let j = i + 1; j < l; j++) {
                if (hand[i] === hand[j]) {
                    ss.unshift(j - i);
                    found = true;
                    break;
                }
            }
            if (!found) {
                ss.unshift(l - i + hand.indexOf(hand[i]));
            }
        }
        var ml = ss.length;
        for (let i = 1; i <= Math.floor(ml / 2); i++) {
            if (!(ml % i)) {
                if (ss.every((cur, j, arr) => j < arr.length - i ? cur === arr[j + i] : true)) {
                    ss = ss.slice(0, i);
                }
            }
        }
        return ss;
    }
}
function sameNumberArray(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    else {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
}
function juggle(b, p) {
    // Get all ball^period tosses
    var psbl = [];
    for (let i = 0; i < Math.pow(b, p); i++) {
        let tmp = [];
        let bl = i;
        for (let j = 0; j < p; j++) {
            tmp.push(bl % b + 1);
            bl = Math.floor(bl / b);
        }
        psbl.push(new Toss(tmp));
    }
    return psbl;
}
function filterByPeriod(psbl, target) {
    var res = [];
    for (let x of psbl) {
        if (x.ss_length === target) {
            res.push(x);
        }
    }
    return res;
}
function filterRotationaryDuplicates(psbl) {
    var res = [];
    var counted = [];
    for (let x of psbl) {
        let y = x.siteswap.slice(0);
        if (!counted.some((cur) => sameNumberArray(cur, y))) {
            let l = x.ss_length;
            for (let i = 0; i < l; i++) {
                let j = y.shift();
                y.push(j);
                counted.push(y.slice(0));
            }
            res.push(x);
        }
    }
    return res;
}
function sortBySiteswap(c) {
    c.sort((a, b) => {
        let ass = a.siteswap;
        let bss = b.siteswap;
        if (ass.length !== bss.length) {
            return ass.length - bss.length;
        }
        else {
            for (let i = 0; i < ass.length; i++) {
                if (ass[i] !== bss[i]) {
                    return ass[i] - bss[i];
                }
            }
            throw new RangeError("There should not be a match!");
        }
    });
    return c;
}
function groupByBall(c) {
    throw new Error("Not implemented yet");
}
function calc(ball, period, ss_sort = true, group_ball = false) {
    var start = Date.now();
    var possibilities = juggle(ball, period);
    possibilities = filterByPeriod(possibilities, period);
    if (ss_sort) {
        try {
            possibilities = sortBySiteswap(possibilities);
        }
        catch (_) {
            return ['', [], false];
        }
    }
    possibilities = filterRotationaryDuplicates(possibilities);
    if (group_ball) {
        console.log("Grouping");
        possibilities = groupByBall(possibilities);
    }
    var end = Date.now();
    var time = `Calculation time: ${end - start} milliseconds`;
    return [time, possibilities, true];
}
var ball = 4;
var period = 6;
var [t, p, e] = calc(ball, period);
if (e) {
    console.log(t);
    console.log(`${p.length} answers:`);
    for (let x of p) {
        console.log(x.siteswap);
    }
}
else {
    console.log("Error");
}
