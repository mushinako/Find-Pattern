"use strict"

function factors(n: number): number[] {
  if (n === 1)
    return [];
  let res: number[] = Array(n+1).fill(0);
  let p: number = 2;
  while (n >= p * p)
    if (n % p)
      p++;
    else {
      n /= p;
      res[p]++;
    }
  res[n]++;
  return res;
}

function mu(n: number): number {
  // Count for any factor > 1 -> 0
  // Odd number of factors    -> -1
  // Even number of factors   -> 1
  let f: number[] = factors(n);
  return f.some(
    (cur: number): boolean => cur > 1
  ) ? 0 : f.reduce(
    (acc: number, cur: number): number => acc + cur, 0
  ) % 2 ? -1 : 1;
}

function calc(b: number, p: number): number[] {
  // \frac{1}{p}\sum_{d|p}{\mu(\frac{p}{d})(b^d-(b-1)^d)} for exact ball
  if (p === 1)
    return Array(b).fill(1);
  let res: number[] = Array(b).fill(0);
  let ds: number[] = dividers(p);
  for (let d of ds)
    for (let i: number = 0; i < b; i++)
      res[i] += mu(p / d) * ((i + 1) ** d - i ** d);
  return res.map((cur: number): number => cur / p);
}

function calcShow(b: number, p: number, res: number[], start: number): void {
  let time: number = (Date.now() - start) / 1000;
  byId('calc-time').innerText = `${time} second${time === 1 ? '' : 's'}`;
  byId('calc-ball').innerText = b.toString();
  byId('calc-peri').innerText = p.toString();
  byId('calc-tot').innerText = res.reduce(
    (acc: number, cur: number) => acc + cur, 0
  ).toString();
  byId('calc-math').innerText = `\\(\\frac{1}{${p}}\\sum_{d|${p}}{\\mu(\\frac{${p}}{d})(${b}^d)}\\)`;
  MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'calc-math']);
  let text: string = '';
  for (let i: number = 0; i < res.length; i++)
    text += `  ${i+1} ball${i ? 's' : ''}: ${res[i]} result${res[i] === 1 ? '' : 's'}\n`;
  let textE: HTMLTextAreaElement = <HTMLTextAreaElement> byId('calc-res');
  textE.value = text.substring(0, text.length-1);
  M.textareaAutoResize(textE);
  byId('calc-card').style.display = 'block';
}

function calcMain(b: number, p: number): void {
  let start: number = Date.now();
  calcShow(b, p, calc(b, p), start);
}
