interface BallGroup {
    [num_of_ball: string]: Array<Toss>;
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
        let tbs: Array<number> = [];
        for (let i: number = 0; i < this.maxball; i++) tbs.push(i);
        let tbso: Array<number> = tbs.slice(0);
        let hand: Array<number> = [];
        do {
            for (let x of this.stack) {
                let in_hand: number = tbs.shift();
                hand.push(in_hand);
                tbs.splice(x - 1, 0, in_hand);
            }
        }
        while (!sameNumberArray(tbs, tbso));
        let ss: Array<number> = [];
        let l: number = hand.length;
        for (let i: number = l - 1; i >= 0; i--) {
            let found: boolean = false;
            for (let j: number = i + 1; j < l; j++) if (hand[i] === hand[j]) {
                ss.unshift(j - i);
                found = true;
                break;
            }
            if (!found) ss.unshift(l - i + hand.indexOf(hand[i]));
        }
        let ml: number = ss.length;
        for (let i: number = 1; i <= Math.floor(ml / 2); i++) if (!(ml % i) && ss.every((cur: number, j: number, arr: Array<number>): boolean => j < arr.length - i ? cur === arr[j + i] : true)) ss = ss.slice(0, i);
        return ss;
    }
}

function sameNumberArray(arr1: Array<number>, arr2: Array<number>): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i: number = 0; i < arr1.length; i++) if (arr1[i] !== arr2[i]) return false;
    return true;
}

function juggle(b: number, p: number): Array<Toss> {
    let psbl: Array<Toss> = [];
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
    let res: Array<Toss> = [];
    for (let x of psbl) if (x.ss_length === target) res.push(x);
    return res;
}

function filterRotationaryDuplicates(psbl: Array<Toss>): Array<Toss> {
    let res: Array<Toss> = [];
    let counted: Array<Array<number>> = [];
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
        if (ass.length !== bss.length) return ass.length - bss.length;
        for (let i: number = 0; i < ass.length; i++) if (ass[i] !== bss[i]) return ass[i] - bss[i];
        throw new RangeError("There should not be a match!");
    });
    return c;
}

function groupByBall(c: Array<Toss>): BallGroup {
    let res: BallGroup = {};
    let len_arr: Array<number> = [];
    for (let x of c) {
        let mb: number = x.maxball;
        if (len_arr.includes(mb)) {
            res[mb].push(x);
        } else {
            len_arr.push(mb);
            res[mb] = [x];
        }
    }
    return res;
}

function toss(b: number, p: number): [BallGroup, number, boolean] {
    let possibilities: Array<Toss> = juggle(b, p);
    possibilities = filterByPeriod(possibilities, p);
    try {
        possibilities = sortBySiteswap(possibilities);
    } catch (_) {
        return [{}, 0, false];
    }
    possibilities = filterRotationaryDuplicates(possibilities);
    let total: number = possibilities.length;
    let res: BallGroup = groupByBall(possibilities);
    return [res, total, true];
}
