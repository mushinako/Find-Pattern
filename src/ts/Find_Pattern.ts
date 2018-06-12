interface Counter {
    [len: string]: Array<Toss>;
}

class Toss {
    public stack: Array<number>;
    public maxball: number;
    public siteswap: Array<number>;
    public ss_length: number;
    public constructor(arr: Array<number>) {
        this.stack = arr;
        this.maxball = Math.max(...this.stack);
        this.siteswap = this.stack2Siteswap();
        this.ss_length = this.siteswap.length;
    }
    private stack2Siteswap(): Array<number> {
        var tbs: Array<number> = [];
        for (let i: number = 0; i < this.maxball; i++) {
            tbs.push(i);
        }
        var tbso: Array<number> = tbs.slice(0);
        var hand: Array<number> = [];
        do {
            for (let x of this.stack) {
                let in_hand: number = tbs.shift();
                hand.push(in_hand);
                tbs.splice(x - 1, 0, in_hand);
            }
        }
        while (!sameNumberArray(tbs, tbso));
        var ss: Array<number> = [];
        var l: number = hand.length;
        for (let i: number = l - 1; i >= 0; i--) {
            let found: boolean = false;
            for (let j: number = i + 1; j < l; j++) {
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
        var ml: number = ss.length;
        for (let i: number = 1; i <= Math.floor(ml / 2); i++) {
            if (!(ml % i)) {
                if (ss.every((cur: number, j: number, arr: Array<number>): boolean => j < arr.length - i ? cur === arr[j + i] : true)) {
                    ss = ss.slice(0, i);
                }
            }
        }
        return ss;
    }
}

function sameNumberArray(arr1: Array<number>, arr2: Array<number>): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    } else {
        for (let i: number = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
}

function juggle(b: number, p: number): Array<Toss> {
    // Get all ball^period tosses
    var psbl: Array<Toss> = [];
    for (let i: number = 0; i < Math.pow(b, p); i++) {
        let tmp: Array<number> = [];
        let bl: number = i;
        for (let j: number = 0; j < p; j++) {
            tmp.push(bl % b + 1);
            bl = Math.floor(bl / b);
        }
        psbl.push(new Toss(tmp));
    }
    return psbl;
}

function filterByPeriod(psbl: Array<Toss>, target: number): Array<Toss> {
    var res: Array<Toss> = [];
    for (let x of psbl) {
        if (x.ss_length === target) {
            res.push(x);
        }
    }
    return res;
}

function filterRotationaryDuplicates(psbl: Array<Toss>): Array<Toss> {
    var res: Array<Toss> = [];
    var counted: Array<Array<number>> = [];
    for (let x of psbl) {
        let y: Array<number> = x.siteswap.slice(0);
        if (!counted.some((cur: Array<number>): boolean => sameNumberArray(cur, y))) {
            let l: number = x.ss_length;
            for (let i: number = 0; i < l; i++) {
                let j: number = y.shift();
                y.push(j);
                counted.push(y.slice(0));
            }
            res.push(x);
        }
    }
    return res;
}

function sortBySiteswap(c: Array<Toss>): Array<Toss> {
    c.sort((a: Toss, b: Toss): number => {
        let ass: Array<number> = a.siteswap;
        let bss: Array<number> = b.siteswap;
        if (ass.length !== bss.length) {
            return ass.length - bss.length;
        } else {
            for (let i: number = 0; i < ass.length; i++) {
                if (ass[i] !== bss[i]) {
                    return ass[i] - bss[i];
                }
            }
            throw new RangeError("There should not be a match!");
        }
    });
    return c;
}

function groupByBall(c: Array<Toss>): Array<Toss> {
    throw new Error("Not implemented yet");
}

function calc(ball: number, period: number, ss_sort: boolean = true, group_ball: boolean = false): [string, Array<Toss>, boolean] {
    var start: number = Date.now();
    var possibilities: Array<Toss> = juggle(ball, period);
    possibilities = filterByPeriod(possibilities, period);
    if (ss_sort) {
        try {
            possibilities = sortBySiteswap(possibilities);
        } catch (_) {
            return ['', [], false];
        }
    }
    possibilities = filterRotationaryDuplicates(possibilities);
    if (group_ball) {
        console.log("Grouping");
        possibilities = groupByBall(possibilities);
    }
    var end: number = Date.now();
    var time: string = `Calculation time: ${end - start} milliseconds`;
    return [time, possibilities, true];
}

var ball = 4;
var period = 6;
var [t, p, e]: [string, Array<Toss>, boolean] = calc(ball, period);
if (e) {
    console.log(t);
    console.log(`${p.length} answers:`);
    for (let x of p) {
        console.log(x.siteswap);
    }
} else {
    console.log("Error");
}
