dgebi = s => document.getElementById(s);

dgebtn = s => document.getElementsByTagName(s);

function containerResize() {
    var win_wid = $(window).width();
    if (win_wid < 550) {
        dgebi('content').style.width = '90%';
        dgebi('content').style.marginLeft = '-' + win_wid / 2 * 0.9 + 'px';
    }
}

function resizer() {
    containerResize();
    $(window).resize(() => {
        containerResize();
    });
}
