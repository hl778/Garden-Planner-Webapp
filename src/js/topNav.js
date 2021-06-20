/**
 * topNav js
 * @content
 *      responsive top nav
 */
'use strict';

$(document).ready(function () {
    // switch nav bar between horizon and vertical menu item
    initNavItem();
    $(window).on('resize', function(){
        // switch nav bar between horizon and vertical menu item
        initNavItem();
  });
    // responsive top nav
    responsiveNav();
    //---------------------------------responsive top nav----------------------------
    function responsiveNav() {
        // get nav wrapper
        let menu = $("#menu")[0],
            WINDOW_CHANGE_EVENT = ('onorientationchange' in window) ? 'orientationchange' : 'resize';

        // toggle mobile drop down list
        function toggleHorizontal() {
            $(menu).removeClass("closing");
            [].forEach.call(
                document.getElementById('menu').querySelectorAll('.can-transform'),
                function (el) {
                    el.classList.toggle('pure-menu-horizontal');
                }
            );
        };

        // toggle nav between mobile and wide view
        function toggleMenu() {
            let rollBack;
            // set timeout so that the panel has a chance to roll up
            // before the menu switches states
            if ($(menu).hasClass("open")) {
                $(menu).addClass("closing");
                rollBack = setTimeout(toggleHorizontal, 500);
            } else {
                if ($(menu).hasClass("closing")) {
                    clearTimeout(rollBack);
                } else {
                    toggleHorizontal();
                }
            }
            $(menu).toggleClass("open");
            $("#toggle").toggleClass("x");
        };

        // close mobile nav
        function closeMenu() {
            if ($(menu).hasClass("open")) {
                toggleMenu();
            }
        }

        // when mobile nav clicked
        $("#toggle").click(function (e) {
            toggleMenu();
            e.preventDefault();
        });
        window.addEventListener(WINDOW_CHANGE_EVENT, closeMenu);
    }
});

function initNavItem() {
    if ($(window).height() < 752) { 
        $("#menu li.stickNavMainEle").removeClass("pure-menu-item");
        $("#menu li.stickNavMainEleSub").removeClass("pure-menu-item");
     }
    if ($(window).width() >= 752) { 
        $("#menu li.stickNavMainEle").addClass("pure-menu-item");
        $("#menu li.stickNavMainEleSub").addClass("pure-menu-item");
     }
}
//------------------------------end of code ----------------------------