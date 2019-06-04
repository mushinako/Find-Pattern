interface Toss {
  maxBall: number;
  siteswap: string;
}

function* stackGen(b: number, p: number): IterableIterator<number[]> {
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

function smolArr(arr1: number[], arr2: number[]): number[] {
  for (let i: number = 0; i < arr1.length; i++) {
    if (arr1[i] < arr2[i])
      return arr1;
    else if (arr1[i] > arr2[i])
      return arr2;
  }
  return arr1;
}

function smolArrSort(arr1: number[], arr2: number[]): number {
  for (let i: number = 0; i < arr1.length; i++) {
    if (arr1[i] < arr2[i])
      return -1;
    else if (arr1[i] > arr2[i])
      return 1;
  }
  return 0;
}

function stack2Siteswap(stack: number[]): Toss {
  let maxBall: number = Math.max(...stack);
  let ballStack: number[] = [...Array(maxBall).keys()];
  let hand: number[] = [];
  do
    for (let move of stack) {
      let inHand: number = ballStack.shift();
      hand.push(inHand);
      ballStack.splice(move-1, 0, inHand);
    }
  while (!ballStack.every((val: number, i: number): boolean => val === i));
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
    siteswap: firstE.map(
      (val: number): number[] => siteswap.slice(val).concat(siteswap.slice(0, val))
    ).reduce(
      (acc: number[], cur: number[]): number[] => smolArr(acc, cur)
    ).join(' ')
  };
}

function correctPer(p: number, divs: number[], arr: number[]): boolean {
  return !divs.some((val: number): boolean => {
    let sub: number[] = arr.slice(0, val);
    let newArr: number[] = Array(p).fill(undefined).map((_, i: number): number => sub[i%val]);
    return newArr.every((v: number, i: number): boolean => v === arr[i]);
  });
}

function filt(b: number, p: number, pre: string[][]): string[][] {
  let prog: number = 0;
  let res: string[][] = Array(b+1).fill(undefined).map((): string[] => []);
  let divs: number[] = dividers(p);
  divs = divs.slice(0, divs.length-1);
  for (let i: number = 1; i < pre.length; i++) {
    let ballGroup = pre[i];
    ballGroup.sort();
    let tmpArr: number[][] = [];
    for (let j: number = 0; j < ballGroup.length; j++) {
      let curStr: string = ballGroup[j];
      let curNum: number[] = curStr.split(' ').map((v: string): number => parseInt(v));
      if (correctPer(p, divs, curNum))
        tmpArr.push(curNum);
      j = ballGroup.lastIndexOf(curStr);
      progress(35+65*(prog+j)/(b**p+b*b+1));
    }
    res[i] = tmpArr.sort(smolArrSort).map((val: number[]): string => val.join(' '));
    prog += ballGroup.length + 1;
    progress(35+65*prog/(b**p+b*b+1));
  }
  return res;
}

function jugg(b: number, p:number): string[][] {
  let sg: IterableIterator<number[]> = stackGen(b, p);
  progress(2);
  let res: string[][] = Array(b+1).fill(undefined).map((): string[] => []);
  for (let i: number = 0; i < b ** p; i++) {
    progress(2+33*i/b**p);
    let stack: number[] = sg.next().value;
    let toss: Toss = stack2Siteswap(stack);
    res[toss.maxBall].push(toss.siteswap);
  }
  progress(35);
  // Filter rotationary duplicates and incorrect periods
  return filt(b, p, res);
}

function juggShow(b: number, p: number, res: string[][], start: number): void {
  byId('prog').style.width = '100%';
  let time: number = (Date.now() - start) / 1000;
  byId('jugg-time').innerText = `${time} second${time === 1 ? '' : 's'}`;
  byId('jugg-ball').innerText = b.toString();
  byId('jugg-peri').innerText = p.toString();
  byId('jugg-tot').innerText = res.reduce(
    (acc: number, cur: string[]) => acc + cur.length, 0
  ).toString();
  let text: string = '';
  for (let i: number = 1; i < res.length; i++) {
    let strs: string[] = res[i];
    text += `  ${i} ball${i === 1 ? '' : 's'}: ${strs.length} result${strs.length === 1 ? '' : 's'}\n`;
    for (let str of strs)
      text += `    ${str}\n`;
    text += '\n';
  }
  let textE: HTMLTextAreaElement = <HTMLTextAreaElement> byId('jugg-res');
  textE.value = text.substring(0, text.length-2);
  M.textareaAutoResize(textE);
  byId('jugg-card').style.display = 'block';
}

function juggMain(b: number, p: number): void {
  byId('prog').style.width = '0%';
  let start = Date.now();
  if (m) {
    // Not implemented
  } else if (w) {
    // Worker
    worker.postMessage([b, p]);
    worker.onmessage = (e: MessageEvent): void => {
      if (e.data[0]) {
        juggShow(b, p, e.data[1], start);
        cleanUp();
      } else
        progress(e.data[1]);
    }
    worker.onerror = (e: ErrorEvent): void => {
      console.log(e);
      byId('jugg-err').style.display = 'block';
      byId('jugg-cont').style.display = 'none';
      byId('jugg-card').style.display = 'block';
      cleanUp();
    };
  } else {
    juggShow(b, p, jugg(b, p), start);
    cleanUp();
  }
}

function progress(val: number) {
  let per: string = `${Math.round(val * 10000) / 10000}%`;
  byId('prog').style.width = per;
  // byId('perc').innerText = per;
}

function save(): void {
  let data: string = byId('jugg-res').innerText;
  if (['Win32', 'Win64', 'Windows', 'WinCE'].indexOf(window.navigator.platform) !== -1)
    data = data.replace(/\n/g, '\r\n');
  let blob: Blob = new Blob([data], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, 'juggle.txt');
}
