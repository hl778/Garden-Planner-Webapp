/**
 * click outside a div to close the div
 */
'use strict';

/**
 *
 * @param nameOfDiv {String} id/class of div
 * @param nameofBtn {String} id/class of button
 * @param nameOfDivParent {String} id/class of div's direct parent, nearest, this will blur background
 */

// prevent windows from closing when datepicker opens
let dateController=false;
function clickOutside(nameOfDiv,nameofBtn,nameOfDivParent) {
    // format selector
    let nameofBtnC = nameofBtn + ',' + nameofBtn+' *';
    let nameOfDivC = nameOfDiv + ',' + nameOfDiv+' *';
    let nameOfDivParentC = nameOfDivParent + ' > *';
    // only hide div, when click outside of div and btn
    $(document).click(function(e){
        if(!($(e.target).is(nameofBtnC)) &&
            !($(e.target).is(nameOfDivC))&&
            !dateController) {
            $(nameOfDiv).hide('fast');
            // un-blur
            $(nameOfDivParentC).css('filter', 'none');
        }
    });
    // in case user pressed ESC to close window
    $(document).keyup(function(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            dateController = false;
        }
    });
}


