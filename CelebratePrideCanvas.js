/*  @preserve
 *  Project: Celebrate Pride Canvas
 *  Description: Puts a rainbow filter over your image like Facebook 'Celebrate Pride'.
 *  Author: Zzbaivong (devs.forumvi.com)
 *  Version: 0.2
 *  License: MIT
 */

/**
 * Get image data
 * @param {Array} files 
 */
function readerImage(files) {
    if (files.length && files[0].type.indexOf('image/') === 0) {
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function (_file) {
            generator(_file.target.result);
        };
    }
}

/**
 * Rainbow image gen
 * @param {String} url Image url
 */
function generator(url) {
    $wrap_img.addClass('generator');
    rainbowLGBT(url, 320, function (img) {
        $wrap_img.html('<a href="' + img + '" download="Celebratepride.png"><img src="' + img + '" alt="Celebratepride.png"></a>');
        $download.attr('href', img);
        $input.prop('disable', false).val('');
        $add.slideUp('fast');
        $complete.slideDown('fast');
        $submit.removeAttr('style');
    });
}

/**
 * Puts a filter over image
 * @param {String} url      Image URL
 * @param {String} callback Export to base64 image
 */
function rainbowLGBT(url, cw, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');

        var w = this.width, // image height
            h = this.height, // image width
            rh = h / w * cw, // ratio height
            ch = rh, // canvas height
            sixthly,
            mh = cw * 1.2; // canvas max height
        if (rh > mh) {
            ch = mh;
        }
        $wrap_img.height(ch);
        sixthly = ch / 6; // 1/6 canvas height

        canvas.width = cw;
        canvas.height = ch;

        ctx.drawImage(this, 0, 0, cw, rh);

        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ff3e18';
        ctx.fillRect(0, 0, cw, sixthly);
        ctx.fillStyle = '#fc9a00';
        ctx.fillRect(0, sixthly, cw, sixthly);
        ctx.fillStyle = '#ffd800';
        ctx.fillRect(0, (sixthly * 2), cw, sixthly);
        ctx.fillStyle = '#39ea7c';
        ctx.fillRect(0, (sixthly * 3), cw, sixthly);
        ctx.fillStyle = '#0bb2ff';
        ctx.fillRect(0, (sixthly * 4), cw, sixthly);
        ctx.fillStyle = '#985aff';
        ctx.fillRect(0, (sixthly * 5), cw, sixthly);

        var dataURL = canvas.toDataURL('image/png');
        if (typeof callback === 'function') {
            callback(dataURL);
        }
        canvas = null;
    };
    img.onerror = function () {
        $submit.css('backgroundImage', 'url(img/cancel.png)');
    };
    img.src = url;
}

var $wrap_img = $('#celebrate-img'),
    $add = $('#celebrate-add'),
    $input = $('#celebrate-input'),
    $submit = $('#celebrate-submit'),
    $complete = $('#celebrate-complete'),
    $reset = $('#celebrate-reset'),
    $download = $('#celebrate-download');

$add.on('submit', function (event) {
    event.preventDefault();
    $input.prop('disable', true);
    $submit.css('backgroundImage', 'url(img/load.gif)');
    generator($input.val());
});

$input.on('input', function () {
    var val = $input.val();
    if ($.trim(val) === '') {
        $submit.css('backgroundImage', 'url(img/enter.png)');
    } else if (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val)) {
        $submit.css('backgroundImage', 'url(img/ok.png)');
    } else {
        $submit.css('backgroundImage', 'url(img/cancel.png)');
    }
});

$reset.on('click', function () {
    $wrap_img.height(320).html('<div><strong>Drop image</strong><br><span>(or click)</span></div>').removeClass('generator');
    $add.slideDown('fast');
    $complete.slideUp('fast');
    $submit.removeAttr('style');
});

$wrap_img.on('dragenter', function () {
    event.preventDefault();
    $wrap_img.addClass('dragging');
});

$wrap_img.on('dragover', function (event) {
    $wrap_img.addClass('dragging');
    event.preventDefault();
});

$wrap_img.on('dragleave', function (event) {
    event.preventDefault();
    $wrap_img.removeClass('dragging');
});

$wrap_img.on('click', function() {
    $('#celebrate-file').click();
});

$wrap_img.on('drop dragdrop', function (event) {
    event.preventDefault();
    $wrap_img.removeClass('dragging');
    readerImage(event.originalEvent.dataTransfer.files);
});

$('html').on('change', '#celebrate-file', function () {
    readerImage(this.files);
    $('#celebrate-file').replaceWith('<input id="celebrate-file" type="file" accept="image/*">');
});