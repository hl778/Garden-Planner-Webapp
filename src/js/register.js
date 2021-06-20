/**
 * register page js
 * @content
 *      full background video
 * @dependency:
 *      vidbg
 *          ~/css/libs/vidbg.css
 *          ~/js/libs/vidbg.js
 */
'use strict';

$(document).ready(function () {
    //-------------------------------initialise background video-----------------------
    // if DOM exists
    if ($('#variableJSON').length) {
        // get ejs variables
        let variableJSON = JSON.parse($('#variableJSON').text());
        // remove DOM
        $('#variableJSON').remove();
        // initialise video background
        let videoBackReg = new vidbg('main', {
            // URL or relative path to MP4 video
            mp4: variableJSON.videoURL,
            webm: null, // URL or relative path to webm video
            // fallback image
            poster: '/assets/img/siteImg/registerFallback.jpg',
            // display the overlay or not
            overlay: true,
            // The overlay color as a HEX
            overlayColor: '#000',
            // The overlay alpha. Think of this as the last integer in RGBA()
            overlayAlpha: 0.1
        }, {
            // Attributes
            autoplay: true,
            controls: false,
            loop: true,
            muted: true,
            playsInline: true
        });
    // if fetch failed, DOM does not exist
    }else {
        // initialise video background
        let videoBackReg = new vidbg('main', {
            // URL or relative path to MP4 video
            mp4: 'https://plfdsfdayer.vimeo.com/external/281270596.hd.mp4?s=e65091e2e3f70559b63ed4a10b30739c1616d603&profile_id=175&oauth2_token_id=57447761',
            webm: '/assets/img/siteImg/registerWebm.webm', // URL or relative path to webm video
            // fallback image
            poster: '/assets/img/siteImg/registerFallback.jpg',
            // display the overlay or not
            overlay: true,
            // The overlay color as a HEX
            overlayColor: '#000',
            // The overlay alpha. Think of this as the last integer in RGBA()
            overlayAlpha: 0.1
        }, {
            // Attributes
            autoplay: true,
            controls: false,
            loop: true,
            muted: true,
            playsInline: true
        });
    }

});

