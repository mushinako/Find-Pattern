function main(j) {
    // Check input
    let ballE = byId('ball');
    let periE = byId('peri');
    ballE.focus();
    // ballE.blur();
    periE.focus();
    periE.blur();
    if (byId('input').checkValidity()) {
        let b = Math.ceil(+ballE.value);
        let p = Math.ceil(+periE.value);
        if (!isNaN(b) && !isNaN(p) && isFinite(b) && isFinite(p)) {
            for (let e of buttons)
                e.disabled = true;
            for (let e of inputs)
                e.disabled = true;
            byId('calc-card').style.display = 'none';
            byId('jugg-card').style.display = 'none';
            calcMain(b, p);
            if (j) {
                byId('prog').style.visibility = 'inherit';
                juggMain(b, p);
                byId('prog').style.visibility = 'hidden';
            }
            for (let e of buttons)
                e.disabled = false;
            for (let e of inputs)
                e.disabled = false;
        }
        else {
            alert('This shouldn\'t happen...');
            console.log(errors);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Check features
    m = Boolean(undefined); // Not implemented
    b = Boolean(Blob);
    w = b && Boolean(Worker);
    errors = [{
            blob: b,
            wasm: m,
            worker: w
        }];
    byId('noscript').style.display = 'none';
    for (let x of buttons)
        x.disabled = false;
    byId('calc').addEventListener('click', () => main(false));
    byId('jugg').addEventListener('click', () => main(true));
    document.addEventListener('keydown', (e) => e.key == 'Enter' ? e.ctrlKey ? main(true) : main(false) : undefined);
});
