class Toss {
    public stack: Array<number>;
    public siteswap: Array<number>;
    public constructor(arr: Array<number>) {
        this.stack = arr;
        this.siteswap = this.stack2Siteswap();
    }
    private stack2Siteswap(): Array<number> {
        var tbs: Array<number> = [];
        for (let i: number = 0; i < Math.max(...this.stack); i++) {
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
                if (ss.every((cur: number, j: number, arr: Array<number>) => j < arr.length-i ? cur === arr[j+i] : true)) {
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

function juggle(b: number, p: number): Array<object> {
    var psbl: Array<object> = [];
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

function main(): void {
    var ball: number = 4;
    var period: number = 6;
    var start: number = Date.now();
    var possibilities: Array<object> = juggle(ball, period);
    var end: number = Date.now();
}
