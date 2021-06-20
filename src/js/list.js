/**
 * list database page js
 * @content
 *  liquid button
 *  fill divs pagination
 *  add form btn
 */
'use strict';

$(document).ready(function () {
    // check checkbox length, then update css
    checkRealBox();
    // update checkbox count
    updateCheckCount();
    //toggle checkbox by img
    $("img.listImg").click(function () {
        // change check box status
        let checkBox = $(this).parent().parent().find( ".subCheck input" );
        checkBox.prop("checked", !checkBox.prop("checked"));
        $(this).parent().parent().toggleClass( "blurImg" );
        // check checkbox length, then update css
        checkRealBox();
        // update checkbox count
        updateCheckCount();
    });
    // reset btn
    $("button.resetBtn").click(function () {
        // reset img
        $(".imgAndTitle").removeClass("blurImg");
        // uncheck box
        $("input.checkboxSub").prop("checked", false);
        // hide btn
        $(".hideWhenNon").hide("fast");
        $("#masterAddBtnId").show("slow");
    });

    // current path
    let currentURL = window.location.pathname;
    //-------------------------------loadmore btn ajax-----------------------------------
    $(".shoudLoadMore").click(function(e) {
        $.ajax({
            url: window.location.pathname+'/true',
            type: 'GET',
            dataType: 'json', // added data type
            success: function(res) {
                if(!res) {
                    $(".liquidWrapper").css("visibility","hidden");
                    $(".lowerWrapper").remove();
                    $(".noMoreMsg").css("display","block");
                }else {
                    res.forEach(function (item) {
                        let shouldAppend;
                        let imageURL = item.imageURL;
                        let imageDefault = item.imageDefault;
                        let plantName = item.plantName;
                        let type = item.type;
                        let createdBy = item.createdBy;
                        let plantDesc = item.plantDesc;
                        let plantDescFromAPI = item.plantDescFromAPI;
                        let imageURLFromAPI = item.imageURLFromAPI;
                        if(imageURL) {
                            shouldAppend = `<div class="pure-u-1 pure-u-sm-11-24 pure-u-md-11-24 imgAndTitle"><div class="pure-u-6-24 listImgWrapper"> <img class="pure-img listImg" src="${imageURL}"></div><div class="desWrapper pure-u-17-24"> <h6 class="Faustina subTitlePlant">${plantName}</h6> <p class="subTypePlant Faustina">${type}</p><p class="subAuthorPlant Faustina"><a href="">by ${createdBy}</a></p><article class="desPlantList"> <p class="Neuton">${plantDesc}</p></article></div>`;
                        }else {
                            shouldAppend = `<div class="pure-u-1 pure-u-sm-11-24 pure-u-md-11-24 imgAndTitle"><div class="pure-u-6-24 listImgWrapper"><img class="pure-img listImg" src="${imageDefault}"></div><div class="desWrapper pure-u-17-24"><h6 class="Faustina subTitlePlant">${plantName}</h6><p class="subTypePlant Faustina">${type}</p><p class="subAuthorPlant Faustina"><a href="">by ${createdBy}</a></p><article class="desPlantList"><p class="Neuton">${plantDesc}</p></article></div></div></div>`;
                        }
                        if(plantDescFromAPI) {
                            shouldAppend = shouldAppend + `<div class="dictionAPILogoWrapper tooltipped" data-position="top" data-tooltip="Text from Merriam-Webster"> <img class="dictionAPILogo" src="https://dictionaryapi.com/images/info/branding-guidelines/MWLogo_DarkBG_120x120_2x.png" alt="dictionaryapi Logo"></div>`;
                        }
                        if(imageURLFromAPI) {
                            shouldAppend = shouldAppend + `<div class="flickrAPILogoWrapper tooltipped" data-position="top" data-tooltip="Image from Flickr"> <img class="dictionAPILogo" src="/usr/520/assets/img/siteImg/flickrlogo.jpg" alt="flickr Logo"></div>`; 
                        }
                        shouldAppend = shouldAppend + `<div class="subCheck" hidden> <label> <input type="checkbox" class="filled-in checkboxSub" name="userPlants[]" value="${plantName}"> <span class="labelReplace"></span> </label></div></div>`;
                        $(".listTotal").append(shouldAppend);
                    });
                    //toggle checkbox by img
                    $("img.listImg").click(function () {
                        // change check box status
                        let checkBox = $(this).parent().parent().find( ".subCheck input" );
                        checkBox.prop("checked", !checkBox.prop("checked"));
                        $(this).parent().parent().toggleClass( "blurImg" );
                        // check checkbox length, then update css
                        checkRealBox();
                        // update checkbox count
                        updateCheckCount();
                    });
                    // reset btn
                    $("button.resetBtn").click(function () {
                        // reset img
                        $(".imgAndTitle").removeClass("blurImg");
                        // uncheck box
                        $("input.checkboxSub").prop("checked", false);
                        // hide btn
                        $(".hideWhenNon").hide("fast");
                        $("#masterAddBtnId").show("slow");
                    });
                }
            },
            error:function (e) {
                console.error(e);
                $(".noMoreMsg").css("display","none");
                $(".moreErrorMsg").css("display","block");
            }
        });
        e.preventDefault();
    });
    //------------------------------------attach index A-Z---------------------------------
    currentURL = currentURL.split('/');
    const paginationFill = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', "<i class='fas fa-backspace'></i>"];
    // append li into div pagination
    paginationFill.forEach(function (item, i) {
        // except the last item
        if (i !== paginationFill.length - 1) {
            let paginationAppend = `<li><a href="/usr/520/list/pageIndex/${item}">${item}</a></li>`;
            $(".pagination").append(paginationAppend);
        } else {
            // the last delete icon
            let paginationAppend = `<li><a href="/usr/520/list">${item}</a></li>`;
            $(".pagination").append(paginationAppend);
        }
        // add active class
        if ($(".pagination li:last-child a").text() == currentURL[currentURL.length - 1]) {
            $(".pagination li:last-child a").addClass('active');
        }
    });
    // font
    $(".pagination li").addClass('Faustina');
    // evt listener on close button
    $(".closeMsg").click(function () {
        $("#addFormMasterId").hide("fast", function () {
            // reset control boolean
            dateController = false;
            // un-blur
            $(".masterList > *").css('filter', 'none');
        });
    });

    //--------------------------------------------pick date-------------------------------
    $('.datepicker').datepicker({
        // Creates a dropdown to control month
        selectMonths: true,
        // Creates a dropdown of 15 years to control year
        yearRange: 15,
        format: 'yyyy-mm-dd',
        // prevent windows from closing when datepicker opens
        onOpen: function () {
            dateController = true;
        },
        onClose: function () {
            dateController = false;
        }
    });
    //reset button
    $('button#listReset').click(function () {
        $(':input', '#addFormWrapper')
            .not(':button, :submit, :reset, :hidden, select')
            .val('')
    });
    //close pop up window
    clickOutside('#addFormMasterId', '#masterAddBtnId', '.masterList');
    //add button
    $("button.activeAddWrapper").click(function () {
        $(".addMasterList").show('slow');
        // blur other divs
        $(".masterList > *:not(#addFormMasterId)").css('filter', 'blur(3px)');
    });
    // close info msg dialog
    // if ejs is passed with info msg
    if ($(".ifHasAdded").length) {
        //show msg
        $(".addedInfoWrapper").show("slow");
        // evt listener on close button
        $(".closeMsg").click(function () {
            $(".addedInfoWrapper").hide("fast", function () {
                $(".addedInfoWrapper").remove();
            });
        });
    }
    //---------------------------------liquid btn----------------------------------------
    // credits: https://codepen.io/waaark/pen/VbgwEM
    let whoBoolean = true;
    // check browser compatibility
    if ((who[0] === 'IE' && who[1] < 10) ||
        (who[0] === 'Chrome' && who[1] < 23) ||
        (who[0] === 'Safari' && who[1] < 6) ||
        (who[0] === 'Edge' && who[1] < 12) ||
        (who[0] === 'Opera' && who[1] < 15)
    ) {
        whoBoolean = false;
    }
    if (whoBoolean) {
        // Vars
        let pointsA = [],
            pointsB = [],
            $canvas = null,
            canvas = null,
            context = null,
            points = 8,
            viscosity = 20,
            mouseDist = 70,
            damping = 0.05,
            showIndicators = false;
        let mouseX = 0,
            mouseY = 0,
            relMouseX = 0,
            relMouseY = 0,
            mouseLastX = 0,
            mouseLastY = 0,
            mouseDirectionX = 0,
            mouseDirectionY = 0,
            mouseSpeedX = 0,
            mouseSpeedY = 0;

        /**
         * Get mouse direction
         */
        function mouseDirection(e) {
            if (mouseX < e.pageX)
                mouseDirectionX = 1;
            else if (mouseX > e.pageX)
                mouseDirectionX = -1;
            else
                mouseDirectionX = 0;
            if (mouseY < e.pageY)
                mouseDirectionY = 1;
            else if (mouseY > e.pageY)
                mouseDirectionY = -1;
            else
                mouseDirectionY = 0;
            mouseX = e.pageX;
            mouseY = e.pageY;
            relMouseX = (mouseX - $canvas.offset().left);
            relMouseY = (mouseY - $canvas.offset().top);
        }

        $(document).on('mousemove', mouseDirection);

        /**
         * Get mouse speed
         */
        function mouseSpeed() {
            mouseSpeedX = mouseX - mouseLastX;
            mouseSpeedY = mouseY - mouseLastY;
            mouseLastX = mouseX;
            mouseLastY = mouseY;
            setTimeout(mouseSpeed, 50);
        }

        mouseSpeed();

        /**
         * Init button
         */
        function initButton() {
            // Get button
            var button = $('.loadmoreLiquid');
            var buttonWidth = button.width();
            var buttonHeight = button.height();
            // Create canvas
            $canvas = $('<canvas></canvas>');
            button.append($canvas);
            canvas = $canvas.get(0);
            canvas.width = buttonWidth + 100;
            canvas.height = buttonHeight + 100;
            context = canvas.getContext('2d');
            context.globalAlpha = 0.5;
            // Add points
            let x = buttonHeight / 2;
            for (let j = 1; j < points; j++) {
                addPoints((x + ((buttonWidth - buttonHeight) / points) * j), 0);
            }
            addPoints(buttonWidth - buttonHeight / 5, 0);
            addPoints(buttonWidth + buttonHeight / 10, buttonHeight / 2);
            addPoints(buttonWidth - buttonHeight / 5, buttonHeight);
            for (let j = points - 1; j > 0; j--) {
                addPoints((x + ((buttonWidth - buttonHeight) / points) * j), buttonHeight);
            }
            addPoints(buttonHeight / 5, buttonHeight);
            addPoints(-buttonHeight / 10, buttonHeight / 2);
            addPoints(buttonHeight / 5, 0);
            renderCanvas();
        }

        /**
         * Add points
         */
        function addPoints(x, y) {
            pointsA.push(new Point(x, y, 1));
            pointsB.push(new Point(x, y, 2));
        }

        /**
         * Point
         */
        function Point(x, y, level) {
            this.x = this.ix = 50 + x;
            this.y = this.iy = 50 + y;
            this.vx = 0;
            this.vy = 0;
            this.cx1 = 0;
            this.cy1 = 0;
            this.cx2 = 0;
            this.cy2 = 0;
            this.level = level;
        }

        Point.prototype.move = function () {
            this.vx += (this.ix - this.x) / (viscosity * this.level);
            this.vy += (this.iy - this.y) / (viscosity * this.level);
            let dx = this.ix - relMouseX,
                dy = this.iy - relMouseY;
            let relDist = (1 - Math.sqrt((dx * dx) + (dy * dy)) / mouseDist);

            // Move x
            if ((mouseDirectionX > 0 && relMouseX > this.x) || (mouseDirectionX < 0 &&
                relMouseX < this.x)) {
                if (relDist > 0 && relDist < 1) {
                    this.vx = (mouseSpeedX / 4) * relDist;
                }
            }
            this.vx *= (1 - damping);
            this.x += this.vx;
            // Move y
            if ((mouseDirectionY > 0 && relMouseY > this.y) || (mouseDirectionY < 0 &&
                relMouseY < this.y)) {
                if (relDist > 0 && relDist < 1) {
                    this.vy = (mouseSpeedY / 4) * relDist;
                }
            }
            this.vy *= (1 - damping);
            this.y += this.vy;
        };

        /**
         * Render canvas
         */
        function renderCanvas() {
            // rAF
            requestAnimationFrame(renderCanvas);

            // Clear scene
            context.clearRect(0, 0, $canvas.width(), $canvas.height());
            context.fillStyle = '#fff';
            context.fillRect(0, 0, $canvas.width(), $canvas.height());

            // Move points
            for (let i = 0; i <= pointsA.length - 1; i++) {
                pointsA[i].move();
                pointsB[i].move();
            }

            // Create dynamic gradient
            let gradientX = Math.min(Math.max(mouseX - $canvas.offset().left, 0), $canvas.width());
            let gradientY = Math.min(Math.max(mouseY - $canvas.offset().top, 0), $canvas.height());
            let distance = Math.sqrt(Math.pow(gradientX - $canvas.width() / 2, 2) + Math.pow(gradientY - $canvas.height() / 2, 2)) / Math.sqrt(Math.pow($canvas.width() / 2, 2) + Math.pow($canvas.height() / 2, 2));

            let gradient = context.createRadialGradient(gradientX, gradientY, 300 + (300 * distance), gradientX, gradientY, 0);
            gradient.addColorStop(0, '#e510a9');
            gradient.addColorStop(1, '#32ee45');

            // Draw shapes
            let groups = [pointsA, pointsB]

            for (let j = 0; j <= 1; j++) {
                let points = groups[j];

                if (j == 0) {
                    // Background style
                    context.fillStyle = '#51add2';
                } else {
                    // Foreground style
                    context.fillStyle = gradient;
                }

                context.beginPath();
                context.moveTo(points[0].x, points[0].y);

                for (let i = 0; i < points.length; i++) {
                    let p = points[i];
                    let nextP = points[i + 1];
                    let val = 30 * 0.552284749831;
                    if (nextP != undefined) {
                        p.cx1 = (p.x + nextP.x) / 2;
                        p.cy1 = (p.y + nextP.y) / 2;
                        p.cx2 = (p.x + nextP.x) / 2;
                        p.cy2 = (p.y + nextP.y) / 2;
                        context.bezierCurveTo(p.x, p.y, p.cx1, p.cy1, p.cx1, p.cy1);
                    } else {
                        nextP = points[0];
                        p.cx1 = (p.x + nextP.x) / 2;
                        p.cy1 = (p.y + nextP.y) / 2;

                        context.bezierCurveTo(p.x, p.y, p.cx1, p.cy1, p.cx1, p.cy1);
                    }
                }

                // context.closePath();
                context.fill();
            }

            if (showIndicators) {
                // Draw points
                context.fillStyle = '#000';
                context.beginPath();
                for (let i = 0; i < pointsA.length; i++) {
                    let p = pointsA[i];

                    context.rect(p.x - 1, p.y - 1, 2, 2);
                }
                context.fill();
                // Draw controls
                context.fillStyle = '#f00';
                context.beginPath();
                for (let i = 0; i < pointsA.length; i++) {
                    let p = pointsA[i];
                    context.rect(p.cx1 - 1, p.cy1 - 1, 2, 2);
                    context.rect(p.cx2 - 1, p.cy2 - 1, 2, 2);
                }
                context.fill();
            }
        }

        // Init
        initButton();
    } else {
        // if browser not compatible
        $(".liquidWrapper").remove();
        $(".lowerWrapper").show();
    }
});

//------------------------------helper functions--------------------------
// checkbox length, then toggle button display prop
function checkRealBox() {
    let checkLength = lengthChecked();
    if(checkLength>0) {
        $(".hideWhenNon").show("slow");
        $("#masterAddBtnId").hide("fast");
    }else {
        $(".hideWhenNon").hide("fast");
        $("#masterAddBtnId").show("slow");
    }
}
// update count checkbox
function updateCheckCount() {
    let checkLength = lengthChecked();
    $("#countCheck").text(checkLength);
}
// return length of checked box
function lengthChecked() {
    return $('.resultForm').find('input[type=checkbox]:checked').length;
}