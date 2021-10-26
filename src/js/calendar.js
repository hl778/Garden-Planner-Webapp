/**
 * calendar page js
 * dhtmlxscheduler
 */
'use strict';
$(document).ready(function () {
    init();
    // resize
        // $('.calendarWrapper').css({'height': (($(window).height()) - 100) + 'px'});
        // $(window).bind('resize', function () {
        //     $('.calendarWrapper').css({'height': (($(window).height()) - 100) + 'px'});
        // });
});

/**
 * @credit: dhtmlxscheduler ()
 */
function init() {
    scheduler.config.xml_date = "%Y-%m-%d %H:%i:%s";
    scheduler.init("scheduler_here", Date.now(), "month");
    // enables the dynamic loading
    scheduler.setLoadMode("day");
    // load data from backend
    scheduler.load("/usr/520/calendar/data", "json");
    // drop down options
    let gardenNumber = [
        { key: 1, label: 'None' },
        { key: 2, label: '1' },
        { key: 3, label: '2' },
        { key: 4, label: '3' },
        { key: 5, label: '4' },
        { key: 6, label: '5' }
    ];
    // color code
    let colorCode = [
        { key: 1, label: 'Default' },
        { key: 2, label: 'Red' },
        { key: 3, label: 'Green' },
        { key: 4, label: 'Blue' },
        { key: 5, label: 'Yellow' },
        { key: 6, label: 'Orange' }
    ];
    // event type
    let eventType = [
        { key: 1, label: 'Default' },
        { key: 2, label: 'Seeding' },
        { key: 3, label: 'Flowering' }
    ];
    // label for drop down
    scheduler.locale.labels.section_select = 'Alert';
    // initialise lightbox
    scheduler.config.lightbox.sections=[
        { name:"Description", height:50, map_to:"text", type:"textarea", focus:true },
        { name:"Plant Name", height:23, map_to:"event_plantName", type:"textarea",
            default_value:"(Optional) Use comma to separate different plants"},
        { name:"Garden Number", height:20,map_to:"type",type:"select", options:gardenNumber},
        { name:"Color Code", height:20,map_to:"type",type:"select", options:colorCode},
        { name:"Event Type", height:20,map_to:"type",type:"select", options:eventType},
        {name:"time", height:72, type:"time", map_to:"auto"}
    ];
    // connect backend to scheduler
    var dp = new dataProcessor("/usr/520/calendar/data");
    // set data exchange mode
    dp.init(scheduler);
    dp.setTransactionMode("POST", false);
}

