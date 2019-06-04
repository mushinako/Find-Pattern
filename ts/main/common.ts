declare var MathJax: any;
declare var M: any;
declare var saveAs: any;

let byId = (s: string): HTMLElement => document.getElementById(s);
let buttons: HTMLCollectionOf<HTMLButtonElement> = document.getElementsByTagName('button');
let inputs: HTMLCollectionOf<HTMLInputElement> = document.getElementsByTagName('input');

// Feature compatibilities
let m: boolean, w: boolean, b: boolean;   // WASM, WebWorkers, Blob

let errors: object[];
let worker: Worker = new Worker('./js/jugg-wk.js');

function dividers(n: number): number[] {
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
