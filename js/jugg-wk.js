function* stackGenW(b, p) {
    for (let i = 0; i < Math.pow(b, p); i++) {
        let ret = Array(p);
        let bl = i;
        for (let j = 0; j < p; j++) {
            ret[j] = bl % b + 1;
            bl = Math.floor(bl / b);
        }
        yield ret;
    }
}
function dividersW(n) {
    // The limiting factor is not this function, and thus I can get away with it
    //   like this, as there will never be large numbers
    let res = [1];
    for (let i = 2; n >= i * i; i++)
        if (!(n % i))
            res.push(i);
    let ser = res.slice(0, -1);
    let sq = n / res[res.length - 1];
    for (let m of ser)
        res.push(n / m);
    if (!res.includes(sq))
        res.push(sq);
    return res.sort();
}
function smolArrW(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] < arr2[i])
            return arr1;
        else if (arr1[i] > arr2[i])
            return arr2;
    }
    return arr1;
}
function smolArrSortW(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] < arr2[i])
            return -1;
        else if (arr1[i] > arr2[i])
            return 1;
    }
    return 0;
}
function stack2SiteswapW(stack) {
    let maxBall = Math.max(...stack);
    let ballStack = [...Array(maxBall).keys()];
    let hand = [];
    do
        for (let move of stack) {
            let inHand = ballStack.shift();
            hand.push(inHand);
            ballStack.splice(move - 1, 0, inHand);
        }
    while (!ballStack.every((val, i) => val === i));
    let doubHand = hand.concat(hand);
    let siteswap = Array(stack.length);
    for (let i = 0; i < stack.length; i++)
        siteswap[i] = doubHand.slice(i + 1).indexOf(doubHand[i]) + 1;
    // Reduce to smallest siteswap
    let min = Math.min(...siteswap);
    let firstE = [];
    for (let i = 0; i < siteswap.length; i++)
        if (siteswap[i] === min)
            firstE.push(i);
    return {
        maxBall: maxBall,
        siteswap: firstE.map(val => siteswap.slice(val).concat(siteswap.slice(0, val))).reduce((acc, cur) => smolArrW(acc, cur)).join(' ')
    };
}
function correctPerW(p, divs, arr) {
    return !divs.some(val => {
        let sub = arr.slice(0, val);
        let newArr = Array(p).fill(undefined).map((_, i) => sub[i % val]);
        return newArr.every((v, i) => v === arr[i]);
    });
}
function filtW(b, p, pre) {
    let prog = 0;
    let res = Array(b + 1).fill(undefined).map(() => []);
    let divs = dividersW(p);
    divs = divs.slice(0, divs.length - 1);
    for (let i = 1; i < pre.length; i++) {
        let ballGroup = pre[i];
        ballGroup.sort();
        let tmpArr = [];
        let tmpProg = 0;
        for (let j = 0; j < ballGroup.length; j++) {
            let curStr = ballGroup[j];
            let curNum = curStr.split(' ').map(v => parseInt(v));
            if (correctPerW(p, divs, curNum))
                tmpArr.push(curNum);
            j = ballGroup.lastIndexOf(curStr);
            tmpProg += 1;
            postMessage([false, `${65 + 35 * (prog + tmpProg) / (Math.pow(b, p) + b * b + 1)}%`]);
        }
        res[i] = tmpArr.sort(smolArrSortW).map(val => val.join(' '));
        prog += ballGroup.length + 1;
        postMessage([false, `${65 + 35 * prog / (Math.pow(b, p) + b * b + 1)}%`]);
    }
    return res;
}
function juggW(b, p) {
    let sg = stackGenW(b, p);
    postMessage([false, '5%']);
    let res = Array(b + 1).fill(undefined).map(() => []);
    for (let i = 0; i < Math.pow(b, p); i++) {
        postMessage([false, `${5 + 60 * i / Math.pow(b, p)}%`]);
        let stack = sg.next().value;
        let toss = stack2SiteswapW(stack);
        res[toss.maxBall].push(toss.siteswap);
    }
    postMessage([false, '65%']);
    // Filter rotationary duplicates and incorrect periods
    return filtW(b, p, res);
}
onmessage = (e) => {
    let [b, p] = e.data;
    let res = juggW(b, p);
    postMessage([true, res]);
};
