function* stackGen(b, p) {
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
function smolArr(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] < arr2[i])
            return arr1;
        else if (arr1[i] > arr2[i])
            return arr2;
    }
    return arr1;
}
function smolArrSort(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] < arr2[i])
            return -1;
        else if (arr1[i] > arr2[i])
            return 1;
    }
    return 0;
}
function stack2Siteswap(stack) {
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
        siteswap: firstE.map((val) => siteswap.slice(val).concat(siteswap.slice(0, val))).reduce((acc, cur) => smolArr(acc, cur)).join(' ')
    };
}
function correctPer(p, divs, arr) {
    return !divs.some((val) => {
        let sub = arr.slice(0, val);
        let newArr = Array(p).fill(undefined).map((_, i) => sub[i % val]);
        return newArr.every((v, i) => v === arr[i]);
    });
}
function filt(b, p, pre) {
    let prog = 0;
    let res = Array(b + 1).fill(undefined).map(() => []);
    let divs = dividers(p);
    divs = divs.slice(0, divs.length - 1);
    for (let i = 1; i < pre.length; i++) {
        let ballGroup = pre[i];
        ballGroup.sort();
        let tmpArr = [];
        for (let j = 0; j < ballGroup.length; j++) {
            let curStr = ballGroup[j];
            let curNum = curStr.split(' ').map((v) => parseInt(v));
            if (correctPer(p, divs, curNum))
                tmpArr.push(curNum);
            j = ballGroup.lastIndexOf(curStr);
            byId('prog').style.width = `${65 + 35 * (prog + j) / (Math.pow(b, p) + b * b + 1)}%`;
        }
        res[i] = tmpArr.sort(smolArrSort).map((val) => val.join(' '));
        prog += ballGroup.length + 1;
        byId('prog').style.width = `${65 + 35 * prog / (Math.pow(b, p) + b * b + 1)}%`;
    }
    return res;
}
function jugg(b, p) {
    let sg = stackGen(b, p);
    byId('prog').style.width = '5%';
    let res = Array(b + 1).fill(undefined).map(() => []);
    for (let i = 0; i < Math.pow(b, p); i++) {
        byId('prog').style.width = `${5 + 60 * i / Math.pow(b, p)}%`;
        let stack = sg.next().value;
        let toss = stack2Siteswap(stack);
        res[toss.maxBall].push(toss.siteswap);
    }
    byId('prog').style.width = '65%';
    // Filter rotationary duplicates and incorrect periods
    return filt(b, p, res);
}
function juggShow(b, p, res, start) {
    byId('prog').style.width = '100%';
    let time = (Date.now() - start) / 1000;
    byId('jugg-time').innerText = `${time} second${time === 1 ? '' : 's'}`;
    byId('jugg-ball').innerText = b.toString();
    byId('jugg-peri').innerText = p.toString();
    byId('jugg-tot').innerText = res.reduce((acc, cur) => acc + cur.length, 0).toString();
    let text = '';
    for (let i = 1; i < res.length; i++) {
        let strs = res[i];
        text += `  ${i} ball${i === 1 ? '' : 's'}: ${strs.length} result${strs.length === 1 ? '' : 's'}\n`;
        for (let str of strs)
            text += `    ${str}\n`;
        text += '\n';
    }
    let textE = byId('jugg-res');
    textE.value = text.substring(0, text.length - 2);
    M.textareaAutoResize(textE);
    byId('jugg-card').style.display = 'block';
}
function juggMain(b, p) {
    byId('prog').style.width = '0%';
    let start = Date.now();
    if (m) {
        // Not implemented
    }
    else if (w) {
        // Worker
        worker.postMessage([b, p]);
        worker.onmessage = (e) => {
            if (e.data[0]) {
                juggShow(b, p, e.data[1], start);
                cleanUp();
            }
            else
                byId('prog').style.width = e.data[1];
        };
        worker.onerror = (e) => {
            console.log(e);
            byId('jugg-err').style.display = 'block';
            byId('jugg-cont').style.display = 'none';
            byId('jugg-card').style.display = 'block';
            cleanUp();
        };
    }
    else {
        juggShow(b, p, jugg(b, p), start);
        cleanUp();
    }
}
