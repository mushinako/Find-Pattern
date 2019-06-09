"use strict";
let byId = (s) => document.getElementById(s);
let buttons = document.getElementsByTagName('button');
let inputs = document.getElementsByTagName('input');
// Feature compatibilities
let m, w, b; // WASM, WebWorkers, Blob
let errors;
let worker = new Worker('./js/jugg-wk.js');
function dividers(n) {
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
