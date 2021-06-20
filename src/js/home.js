/**
 * index page js
 * @content
 *      mouse over menu
 *      sticky top nav
 */
'use strict';

$(document).ready(function () {
    // tooltips
    $('.tooltipped').tooltip();

    // fadeout flash card info if any
    // such as "please log out before continue"
    $(".infoCard").fadeOut(3000);
    // top nav offsets
    const SHOW_TOP_NAV = 100;
    //---------------------------------mouse-over-menu effect----------------------------
    $(".indexEle").mouseover(function () {
        $(this).css("cursor", "pointer")
            .css("box-shadow", "0 0 15px rgba(236, 196, 147, 0.96)");
        $("a", this).css({
            "color": "rgba(16, 255, 48, 0.82)",
            "box-shadow": "0 0 5px #161615",
            "text-shadow": "0 0 5px #ffee10",
            "transition": ".5s"
        });
        if ($(this).hasClass("indexLeft")) {
            $("a", this).css({
                "padding": "0px 2px 0px 15px"
            });
        } else if ($(this).hasClass("indexRight")) {
            $("a", this).css({
                "padding": "0px 15px 0px 2px"
            });
        }
    }).mouseout(function () {
        // set to default css
        $(this).css("box-shadow", "none");
        $("a", this).css({
            "padding": "0px 0px 0px 0px",
            "box-shadow": "none",
            "text-shadow": "none",
            "transition": ".5s",
            "text-decoration": "none",
            "color": "rgba(241, 243, 250, 0.93)",
            "font-weight": "normal"
        });
    }).click(function () {
        window.location = $(this).find(".indexMasterLink").attr("href");
        return false;
    });
    // top nav sticky behaviour
    stickyNav();

    //---------------------------------top nav sticky behaviour--------------------
    function stickyNav() {
        // if scrolled
        window.onscroll = function () {
            scrollStick()
        };
        let navbar = $("#menu")[0];

        function scrollStick() {
            if (window.pageYOffset >= SHOW_TOP_NAV) {
                $(navbar).addClass("stickyNav");
                $(navbar).show(250);
                // except user authentication menu items
                $(".onlyPassMain").css("visibility", "visible");
            } else {
                navbar.classList.remove("stickyNav");
                $(navbar).hide();
                // except user authentication menu items
                $(".onlyPassMain").css("visibility", "hidden");
            }
        }
    }
});

//------------------------------end of code ----------------------------