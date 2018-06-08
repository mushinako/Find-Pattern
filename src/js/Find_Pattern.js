class Toss {
    constructor(arr) {
        this.stack = arr;
        this.siteswap = this.stack2Siteswap();
    }
    stack2Siteswap() {
        var tbs = [];
        for (let i = 0; i < Math.max(...this.stack); i++) {
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
function main() {
    var ball = 4;
    var period = 6;
    var start = Date.now();
    var possibilities = juggle(ball, period);
    var end = Date.now();
}
