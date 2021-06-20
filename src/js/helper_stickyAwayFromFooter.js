/**
 * get fixed div away from footer
 */
'use strict';

$(document).ready(function () {
    // fixed btn away from footer
    $(window).scroll(() => {
        stickyAwayFromFooter();
    });
});

// fixed div class name is .activeAddWrapper
// fixed div's parent class name is .activeAddWrapperParent
// fixed button not exceeds footer
function stickyAwayFromFooter() {
    // above footer px
    const footerOffset = 10;
    // if above footer
    if($('.activeAddWrapper,.activeAddWrapperCollec').offset().top + $('.activeAddWrapper,.activeAddWrapperCollec').height()
        >= $('footer').offset().top - footerOffset) {
        $('.activeAddWrapper,.activeAddWrapperCollec').css('position', 'absolute');
    }
    //return to fix
    if($(document).scrollTop() + window.innerHeight < $('footer').offset().top){
        $('.activeAddWrapper,.activeAddWrapperCollec').css('position', 'fixed'); // restore when scroll up
    }
}