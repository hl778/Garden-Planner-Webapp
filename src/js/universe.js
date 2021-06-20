/**
 * nav bar behaviour for all the other pages except index page
 * @content
 *      sticky top nav
 */
'use strict';

$(document).ready(function () {
    // tooltip
    $('.tooltipped').tooltip();
    // top nav sticky behaviour
    stickyNav();

    //---------------------------------top nav sticky behaviour--------------------
    function stickyNav() {
        let navbar = $("#menu")[0];
        makeSticky();
        // add class to top nav bar
        function makeSticky() {
            $(navbar).addClass("stickyNav");
            $(navbar).show(250);
            // except user authentication menu items
            $(".onlyPassMain").css("visibility", "visible");
        }
    }
});

//------------------------------end of code ----------------------------