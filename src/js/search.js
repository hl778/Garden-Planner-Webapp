/**
 * search page js
 *  auto-complete search box as typing
 *  fade out warning msg
 *  toggle checkbox and img
 */

'use strict';

$(document).ready(function () {
    // set img for each plant
    $("p.searchImg").each(function () {
        let srcImg = $(this).text();
        $(this).parent().css("background-image", 'url(' + srcImg + ')');
    });
    // fixed btn away from footer
    $(window).scroll(() => {
        stickyAwayFromFooter();
    });
    // fadeout flash card info if any
    $(".infoCard").fadeOut(6000);
    //toggle checkbox by img
    $(".imgAndTitle .imgSubWrapper").click(function () {
        // change check box status
        let checkBox = $(this).parent().find( "input" );
        checkBox.prop("checked", !checkBox.prop("checked"));
        $(this).toggleClass( "blurImg" );
        // check checkbox length, then update css
        checkRealBox(lengthChecked());
        // update checkbox count
        updateCheckCount(lengthChecked());
        stickyAwayFromFooter();
    });
    // toggle img by checkbox
    $(".subCheck input.checkboxSub").click(function () {
        $(this).closest(".imgAndTitle").find( ".imgSubWrapper" ).toggleClass( "blurImg" );
        // check checkbox length, then update css
        checkRealBox(lengthChecked());
        // update checkbox count
        updateCheckCount(lengthChecked());
        stickyAwayFromFooter();
    });
    // reset btn
    $("button.resetBtn").click(function () {
        // reset img
        $(".imgSubWrapper").removeClass("blurImg");
        // uncheck box
        $("input.checkboxSub").prop("checked", false);
        // hide btn
        $(".hideWhenNon").hide("fast");
    });

    // close info msg dialog
    // if ejs is passed with info msg
    if($(".ifHasAdded").length) {
        //show msg
        $(".addedInfoWrapper").show("slow");
        // evt listener on close button
        $(".closeMsg").click(function () {
            $(".addedInfoWrapper").hide("fast",function () {
                $(".addedInfoWrapper").remove();
            });
        });
    }
});

//------------------------------helper functions--------------------------
// checkbox length, then toggle button display prop
function checkRealBox(checkLength) {
    if(checkLength>0) {
        $(".hideWhenNon").show("slow");
    }else {
        $(".hideWhenNon").hide("fast");
    }
}
// update count checkbox
function updateCheckCount(checkLength) {
    $("#countCheck").text(checkLength);
}
// return length of checked box
function lengthChecked() {
    return $('.resultForm').find('input[type=checkbox]:checked').length;
}
// prevent fixed-btn exceeds beyond footer
function stickyAwayFromFooter() {
    // above footer px
    const footerOffset = 1;
    // if above footer
    if($('.activeAddWrapper').offset().top + $('.activeAddWrapper').height()
        >= $('footer').offset().top - footerOffset) {
        $('.activeAddWrapper').css('position', 'absolute');
        $('.collecBtn').css({'bottom':'0px'});
        $('.resetBtn').css({'bottom':'40px'});
    }
    //return to fix
    if($(document).scrollTop() + window.innerHeight < $('footer').offset().top){
        $('.activeAddWrapper').css('position', 'fixed'); // restore when scroll up
        $('.collecBtn').css({'bottom':'30px'});
        $('.resetBtn').css({'bottom':'70px'});
    }
}