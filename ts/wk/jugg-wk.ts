interface TossW {
  maxBall: number;
  siteswap: string;
}

function* stackGenW(b: number, p: number): IterableIterator<number[]> {
  for (let i: number = 0; i < b ** p; i++) {
    let ret: number[] = Array(p);
    let bl: number = i;
    for (let j: number = 0; j < p; j++) {
      ret[j] = bl % b + 1;
      bl = Math.floor(bl / b);
    }
    yield ret;
  }
}

function dividersW(n: number): number[] {
  // The limiting factor is not this function, and thus I can get away with it
  //   like this, as there will never be large numbers
  let res: number[] = [1];
  for (let i: number = 2; n >= i * i; i++)
    if (!(n % i))
      res.push(i);
  let ser: number[] = res.slice(0, -1);
  let sq: number = n / res[res.length-1];
  for (let m of ser)
    res.push(n/m);
  if (!res.includes(sq))
    res.push(sq);
  return res.sort();
}

function smolArrW(arr1: number[], arr2: number[]): number[] {
  for (let i: number = 0; i < arr1.length; i++) {
    if (arr1[i] < arr2[i])
      return arr1;
    else if (arr1[i] > arr2[i])
      return arr2;
  }
  return arr1;
}

function smolArrSortW(arr1: number[], arr2: number[]): number {
  for (let i: number = 0; i < arr1.length; i++) {
    if (arr1[i] < arr2[i])
      return -1;
    else if (arr1[i] > arr2[i])
      return 1;
  }
  return 0;
}

function stack2SiteswapW(stack: number[]): TossW {
  let maxBall: number = Math.max(...stack);
  let ballStack: number[] = [...Array(maxBall).keys()];
  let hand: number[] = [];
  do
    for (let move of stack) {
      let inHand: number = ballStack.shift();
      hand.push(inHand);
      ballStack.splice(move-1, 0, inHand);
    }
  while (!ballStack.every((val, i) => val === i));
  let doubHand: number[] = hand.concat(hand);
  let siteswap = Array(stack.length);
  for (let i: number = 0; i < stack.length; i++)
    siteswap[i] = doubHand.slice(i+1).indexOf(doubHand[i]) + 1;
  // Reduce to smallest siteswap
  let min: number = Math.min(...siteswap);
  let firstE: number[] = [];
  for (let i: number = 0; i < siteswap.length; i++)
    if (siteswap[i] === min)
      firstE.push(i);
  return {
    maxBall: maxBall,
    siteswap: firstE.map(val => siteswap.slice(val).concat(siteswap.slice(0, val))).reduce((acc, cur) => smolArrW(acc, cur)).join(' ')
  };
}

function correctPerW(p: number, divs: number[], arr: number[]): boolean {
  return !divs.some(val => {
    let sub: number[] = arr.slice(0, val);
    let newArr: number[] = Array(p).fill(undefined).map((_, i) => sub[i%val]);
    return newArr.every((v, i) => v === arr[i]);
  });
}

function filtW(b: number, p: number, pre: string[][]): string[][] {
  let prog: number = 0;
  let res: string[][] = Array(b+1).fill(undefined).map(() => []);
  let divs: number[] = dividersW(p);
  divs = divs.slice(0, divs.length-1);
  for (let i: number = 1; i < pre.length; i++) {
    let ballGroup = pre[i];
    ballGroup.sort();
    let tmpArr: number[][] = [];
    for (let j: number = 0; j < ballGroup.length; j++) {
      let curStr: string = ballGroup[j];
      let curNum: number[] = curStr.split(' ').map(v => parseInt(v));
      if (correctPerW(p, divs, curNum))
        tmpArr.push(curNum);
      j = ballGroup.lastIndexOf(curStr);
      postMessage([false, `${65+35*(prog+j)/(b**p+b*b+1)}%`]);
    }
    res[i] = tmpArr.sort(smolArrSortW).map(val => val.join(' '));
    prog += ballGroup.length + 1;
    postMessage([false, `${65+35*prog/(b**p+b*b+1)}%`]);
  }
  return res;
}

function juggW(b: number, p:number): string[][] {
  let sg: IterableIterator<number[]> = stackGenW(b, p);
  postMessage([false, '5%']);
  let res: string[][] = Array(b+1).fill(undefined).map(() => []);
  for (let i: number = 0; i < b ** p; i++) {
    postMessage([false, `${5+60*i/b**p}%`]);
    let stack: number[] = sg.next().value;
    let toss: TossW = stack2SiteswapW(stack);
    res[toss.maxBall].push(toss.siteswap);
  }
  postMessage([false, '65%']);
  // Filter rotationary duplicates and incorrect periods
  return filtW(b, p, res);
}

onmessage = (e) => {
  let [b, p]: number[] = e.data;
  let res: string[][] = juggW(b, p);
  postMessage([true, res]);
}
