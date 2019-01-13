interface BallGroup {
    [num_of_ball: string]: Toss[];
}

class Toss {
    public stack: number[];
    public maxball: number;
    public siteswap: number[];
    public ss_length: number;
    public constructor(arr: number[]) {
        this.stack = arr;
        this.maxball = Math.max(...this.stack);
        this.siteswap = this.stack2Siteswap();
        this.ss_length = this.siteswap.length;
    }
    private stack2Siteswap(): number[] {
        let tbs: number[] = [];
        for (let i: number = 0; i < this.maxball; i++)
            tbs.push(i);
        let tbso: number[] = tbs.slice(0);
        let hand: number[] = [];
        do
            for (let x of this.stack) {
                    let in_hand: number = tbs.shift();
                    hand.push(in_hand);
                    tbs.splice(x - 1, 0, in_hand);
            }
        while (!sameNumberArray(tbs, tbso));
        let ss: number[] = [];
        let l: number = hand.length;
        for (let i: number = l - 1; i >= 0; i--) {
            let found: boolean = false;
            for (let j: number = i + 1; j < l; j++)
                if (hand[i] === hand[j]) {
                    ss.unshift(j - i);
                    found = true;
                    break;
                }
            !found && ss.unshift(l - i + hand.indexOf(hand[i]));
        }
        let ml: number = ss.length;
        for (let i: number = 1; i <= Math.floor(ml / 2); i++)
            (!(ml % i)
            && ss.every((cur: number, j: number, arr: number[]): boolean => j < arr.length - i ? cur === arr[j + i] : true)
            && (ss = ss.slice(0, i)));
        return ss;
    }
}

function sameNumberArray(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length)
        return false;
    for (let i: number = 0; i < arr1.length; i++)
        if (arr1[i] !== arr2[i])
            return false;
    return true;
}

function juggle(b: number, p: number): Toss[] {
    let psbl: Toss[] = [];
    for (let i: number = 0; i < Math.pow(b, p); i++) {
        let tmp: number[] = [];
        let bl: number = i;
        for (let j: number = 0; j < p; j++) {
            tmp.push(bl % b + 1);
            bl = Math.floor(bl / b);
        }
        psbl.push(new Toss(tmp));
    }
    return psbl;
}

function filterByPeriod(psbl: Toss[], target: number): Toss[] {
    let res: Toss[] = [];
    for (let x of psbl)
        if (x.ss_length === target)
            res.push(x);
    return res;
}

function filterRotationaryDuplicates(psbl: Toss[]): Toss[] {
    let res: Toss[] = [];
    let counted: number[][] = [];
    for (let x of psbl) {
        let y: number[] = x.siteswap.slice(0);
        if (!counted.some((cur: number[]): boolean => sameNumberArray(cur, y))) {
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

function sortBySiteswap(c: Toss[]): Toss[] {
    c.sort((a: Toss, b: Toss): number => {
        let ass: number[] = a.siteswap;
        let bss: number[] = b.siteswap;
        if (ass.length !== bss.length)
            return ass.length - bss.length;
        for (let i: number = 0; i < ass.length; i++)
            if (ass[i] !== bss[i])
                return ass[i] - bss[i];
        throw new RangeError("There should not be a match!");
    });
    return c;
}

function groupByBall(c: Toss[]): BallGroup {
    let res: BallGroup = {};
    let len_arr: number[] = [];
    for (let x of c) {
        let mb: number = x.maxball;
        if (len_arr.includes(mb))
            res[mb].push(x);
        else {
            len_arr.push(mb);
            res[mb] = [x];
        }
    }
    return res;
}

function toss(b: number, p: number): [BallGroup, number, boolean, string] {
    let possibilities: Toss[] = juggle(b, p);
    possibilities = filterByPeriod(possibilities, p);
    try {
        possibilities = sortBySiteswap(possibilities);
    }
    catch (e) {
        return [{}, 0, false, e];
    }
    possibilities = filterRotationaryDuplicates(possibilities);
    let total: number = possibilities.length;
    let res: BallGroup = groupByBall(possibilities);
    return [res, total, true, ""];
}
