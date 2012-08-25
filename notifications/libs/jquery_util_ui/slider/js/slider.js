// Hive Colony Framework
// Copyright (C) 2010 Hive Solutions Lda.
//
// This file is part of Hive Colony Framework.
//
// Hive Colony Framework is confidential and property of Hive Solutions Lda.,
// its usage is constrained by the terms of the Hive Solutions
// Confidential Usage License.
//
// Hive Colony Framework should not be distributed under any circumstances,
// violation of this may imply legal action.
//
// If you have any questions regarding the terms of this license please
// refer to <http://www.hive.pt/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2010 Hive Solutions Lda.
// __license__   = Hive Solutions Confidential Usage License (HSCUL)

/**
 * jQuery slider plugin, this jQuery plugin is a simple slider implementation
 * meant to be used in http://hive.pt website.
 *
 * @name jquery-slider.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.slider = function(method, options) {
        // the slider thumbnail width
        var SLIDER_THUMBNAIL_WIDTH = 137;

        // the slider screenshot width
        var SLIDER_SCREENSHOT_WIDTH = 560;

        // the slider screenshot margin
        var SLIDER_SCREENSHOT_MARGIN = 12;

        // the default values for the slideshow
        var defaults = {
            sets : [],
            width : SLIDER_SCREENSHOT_WIDTH,
            margin : SLIDER_SCREENSHOT_MARGIN
        };

        // sets the default method value
        var method = method ? method : "default";

        // sets the default options value
        var options = options ? options : {};

        // constructs the options
        var options = jQuery.extend(defaults, options);

        // sets the jquery matched object
        var matchedObject = this;

        /**
         * Initializer of the plugin, runs the necessary functions to initialize
         * the structures.
         */
        var initialize = function() {
            _appendHtml();
            _registerHandlers();
        };

        /**
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {
            // retrieves the contents
            var contents = options["contents"]
                    ? options["contents"]
                    : matchedObject;

            // retrieves the selector
            var selector = options["selector"]
                    ? options["selector"]
                    : matchedObject;

            // retrieves the sets
            var sets = options["sets"];

            // retrieves the width
            var width = options["width"];

            // retrieves the margin
            var margin = options["margin"];

            // retrieves the set index
            var setIndex = options["setIndex"] ? options["setIndex"] : 0;

            // retrieves the screenshot index
            var screenshotIndex = options["screenshotIndex"]
                    ? options["screenshotIndex"]
                    : 0;

            // retrieves the thumbnail index
            var thumbnailIndex = options["thumbnailIndex"]
                    ? options["thumbnailIndex"]
                    : 0;

            // retrieves the sets length
            var setsLength = sets.length;

            // appends the html to the matched object
            matchedObject.append("<div class=\"jquery-slider-contents\">"
                    + "<div class=\"jquery-slider-container\">"
                    + "<div class=\"jquery-slider-container-slider\"></div>"
                    + "</div>" + "</div>"
                    + "<div class=\"jquery-slider-buttons\">" + "<ul></ul>"
                    + "</div>");

            // appends the html to the selector object
            selector.append("<div class=\"jquery-slider-selector-button jquery-slider-selector-button-left\"></div>"
                    + "<div class=\"jquery-slider-selector-container\">"
                    + "<div class=\"jquery-slider-selector-container-slider\">"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"jquery-slider-selector-button jquery-slider-selector-button-right\"></div>");

            // iterates over all the sets
            for (var index in sets) {
                // retrieves the current set
                var currentSet = sets[index];

                // retrieves the current set thumbnail
                var currentSetThumbnail = currentSet["thumbnail"];

                // retrieves the slider selector container slider
                var sliderSelectorContainerSlider = jQuery(
                        ".jquery-slider-selector-container-slider", selector);

                // adds the thumbnail image
                sliderSelectorContainerSlider.append("<div class=\"jquery-slider-selector-thumbnail\">"
                        + "<img class=\"jquery-slider-selector-thumbnail-image\" src=\""
                        + currentSetThumbnail + "\" />" + "</div>");
            }

            // in case the sets length is not enought
            // to allow button (arrow) visibility
            if (setsLength < 4) {
                // retrieves the slider selector buttons
                var sliderSelectorButton = jQuery(
                        ".jquery-slider-selector-button", selector);

                // hides the slider selector buttons
                sliderSelectorButton.css("visibility", "hidden");
            }

            // calculates the slider selector container slider with
            var sliderSelectorContainerSliderWidth = SLIDER_THUMBNAIL_WIDTH
                    * setsLength;

            // retrieves the slider selector container slider
            var sliderSelectorContainerSlider = jQuery(
                    ".jquery-slider-selector-container-slider", selector);

            // sets the slider selector container slider with
            sliderSelectorContainerSlider.width(sliderSelectorContainerSliderWidth);

            // sets the slider in the contents
            contents.data("slider", matchedObject);

            // sets the slider in the selector
            selector.data("slider", matchedObject);

            // adds the slider class
            matchedObject.addClass("jquery-slider");

            // adds the slider selector class
            selector.addClass("jquery-slider-selector");

            // sets the contents in the matched object
            matchedObject.data("contents", contents);

            // sets the selector in the matched object
            matchedObject.data("selector", selector);

            // sets the initial sets in the matched object
            matchedObject.data("sets", sets);

            // sets the initial width in the matched object
            matchedObject.data("width", width);

            // sets the initial margin in the matched object
            matchedObject.data("margin", margin);

            // sets the initial set index in the matched object
            matchedObject.data("setIndex", setIndex);

            // sets the initial screenshot index in the matched object
            matchedObject.data("screenshotIndex", screenshotIndex);

            // sets the initial thumbnail index in the matched object
            matchedObject.data("thumbnailIndex", thumbnailIndex);

            // iterates over each matched object
            matchedObject.each(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // updates the current status
                        _update(element, options);
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the selector
            var selector = matchedObject.data("selector");

            // retrieves the slider selector thumbnail
            var sliderSelectorThumbnail = jQuery(
                    ".jquery-slider-selector-thumbnail", selector);

            // retrieves the slider selector button left
            var sliderSelectorButtonLeft = jQuery(
                    ".jquery-slider-selector-button-left", selector);

            // retrieves the slider selector button right
            var sliderSelectorButtonRight = jQuery(
                    ".jquery-slider-selector-button-right", selector);

            // registers for the click event
            sliderSelectorThumbnail.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the slider selector
                var sliderSelector = element.parents(".jquery-slider-selector");

                // retrieves the slider
                var slider = sliderSelector.data("slider");

                // retrieves the index of the element
                var index = element.index();

                // sets the set index in the options
                options["setIndex"] = index;

                // moves to the screenshot index
                __moveToSetIndex(slider, options);
            });

            // registers for the click event
            sliderSelectorButtonLeft.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the selector
                        var selector = element.parents(".jquery-slider-selector");

                        // retrieves the slider
                        var slider = selector.data("slider");

                        // moves the thumbnails to the left
                        __moveThumbnailsLeft(slider, options);
                    });

            // registers for the click event
            sliderSelectorButtonRight.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the selector
                        var selector = element.parents(".jquery-slider-selector");

                        // retrieves the slider
                        var slider = selector.data("slider");

                        // moves the thumbnails to the right
                        __moveThumbnailsRight(slider, options);
                    });
        };

        var _move = function(matchedObject, options) {
            // moves to the set index
            __moveToSetIndex(matchedObject, options);
        };

        var __moveThumbnailsLeft = function(matchedObject, options) {
            // retrieves the thumbnail index
            var thumbnailIndex = matchedObject.data("thumbnailIndex");

            // decrements the current thumbnail index
            thumbnailIndex -= 1;

            // sets the thumbnail index in the options
            options["thumbnailIndex"] = thumbnailIndex;

            // moves to the thumbnail index
            __moveToThumbnailIndex(matchedObject, options);
        };

        var __moveThumbnailsRight = function(matchedObject, options) {
            // retrieves the thumbnail index
            var thumbnailIndex = matchedObject.data("thumbnailIndex");

            // increments the current thumbnail index
            thumbnailIndex += 1;

            // sets the thumbnail index in the options
            options["thumbnailIndex"] = thumbnailIndex;

            // moves to the thumbnail index
            __moveToThumbnailIndex(matchedObject, options);
        };

        var _update = function(matchedObject, options) {
            // retrieves the contents
            var contents = matchedObject.data("contents");

            // retrieves the selector
            var selector = matchedObject.data("selector");

            // retrieves the sets
            var sets = matchedObject.data("sets");

            // retrieves the width
            var width = matchedObject.data("width");

            // retrieves the margin
            var margin = matchedObject.data("margin");

            // retrieves the set index
            var setIndex = matchedObject.data("setIndex");

            // retrieves the thumbnail index
            var thumbnailIndex = matchedObject.data("thumbnailIndex");

            // retrieves the current set
            var currentSet = sets[setIndex];

            // retrieves the current set screenshots
            var currentSetScreenshots = currentSet["screenshots"]
                    ? currentSet["screenshots"]
                    : [];

            // retrieves the current set contents
            var currentSetContents = currentSet["contents"]
                    ? currentSet["contents"]
                    : "";

            // retrieves the current set screenshots length
            var currentSetScreenshotsLength = currentSetScreenshots.length;

            // retrieves the document element
            var _document = jQuery(document);

            // retrieves the slider container slider
            var sliderContainerSlider = jQuery(
                    ".jquery-slider-container-slider", matchedObject);

            // retrieves the slider selector container slider
            var sliderSelectorContainerSlider = jQuery(
                    ".jquery-slider-selector-container-slider", selector);

            // retrieves the slider buttons list
            var sliderButtonsList = jQuery(".jquery-slider-buttons > ul",
                    matchedObject);

            // calculates the margin left (for the thumbnails)
            var marginLeft = 408 * thumbnailIndex * -1;

            // retrieves and parses as integer the previous margin
            // left for the thumbnails
            var previousMarginLeft = sliderSelectorContainerSlider.css("margin-left");
            previousMarginLeft = parseInt(previousMarginLeft);

            // animates the slider selector container slider to the desired index
            sliderSelectorContainerSlider.animate({
                        "margin-left" : String(marginLeft) + "px"
                    }, 300);

            // in case the update was targeted only at the thumbnails
            // (the margin on them changed) there's no nedd to update anything else
            if (marginLeft != previousMarginLeft) {
                // returns immediately
                return;
            }

            // empties the slider container slider
            sliderContainerSlider.empty();

            // empties the slider buttons list
            sliderButtonsList.empty();

            // iterates over all the current set screenshots
            for (var index in currentSetScreenshots) {
                // retrieves the current set screenshot
                var currentSetScreenshot = currentSetScreenshots[index];

                // adds the screenshot to the slider container slider
                sliderContainerSlider.append("<img class=\"jquery-slider-image\" src=\""
                        + currentSetScreenshot + "\" />");

                // adds the list item to the slider buttons list
                sliderButtonsList.append("<li></li>");
            }

            // calculates the slider container slider with
            var sliderContainerSliderWidth = currentSetScreenshotsLength
                    * (width + margin)

            // updates the slider container slider width
            sliderContainerSlider.width(sliderContainerSliderWidth);

            // sets the current set contents in the contents
            contents.html(currentSetContents);

            // retrieves the slider buttons list items
            var sliderButtonsListItems = jQuery(
                    ".jquery-slider-buttons > ul > li", matchedObject);

            // registers for the click event
            sliderButtonsListItems.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the slider
                        var slider = element.parents(".jquery-slider");

                        // retrieves the index of the element
                        var index = element.index();

                        // sets the screenshot index in the options
                        options["screenshotIndex"] = index;

                        // moves to the screenshot index
                        __moveToScreenshotIndex(slider, options);
                    });

            // unbinds the document from the (previous) keydown event
            _document.unbind("keydown", __updateScreenshotKeyboard);

            // binds the document to the keydown event
            _document.keydown(__updateScreenshotKeyboard);

            // updates the screenshot
            _updateScreenshot(matchedObject, options);
        };

        var _updateScreenshot = function(matchedObject, options) {
            // retrieves the screenshot index
            var screenshotIndex = matchedObject.data("screenshotIndex");

            // retrieves the width
            var width = options["width"]
                    ? options["width"]
                    : matchedObject.data("width")

            // retrieves the margin
            var margin = options["margin"]
                    ? options["margin"]
                    : matchedObject.data("margin")

            // retrieves the slider container slider
            var sliderContainerSlider = jQuery(
                    ".jquery-slider-container-slider", matchedObject);

            // retrieves the slider buttons list items
            var sliderButtonsListItems = jQuery(
                    ".jquery-slider-buttons > ul > li", matchedObject);

            // calculates the margin left
            var marginLeft = screenshotIndex * (width + margin) * -1;

            // removes the selected class from the slider buttons list items
            sliderButtonsListItems.removeClass("selected");

            // animates the slider container slider to the desired index
            sliderContainerSlider.animate({
                        "margin-left" : String(marginLeft) + "px"
                    }, 500);

            // retrieves the slider buttons list item
            var sliderButtonsListItem = sliderButtonsListItems.get(screenshotIndex);

            // retrieves the current slider buttons list item
            var currentSliderButtonsListItem = jQuery(sliderButtonsListItem);

            // adds the selected class to the current slider buttons list item
            currentSliderButtonsListItem.addClass("selected");
        };

        var __moveToSetIndex = function(matchedObject, options) {
            // retrieves the set index
            var setIndex = options["setIndex"];

            // retrieves the contents
            var contents = matchedObject.data("contents");

            // sets the set index in the matched object
            matchedObject.data("setIndex", setIndex);

            // resets the screenshot index
            matchedObject.data("screenshotIndex", 0);

            // runs the fade transition in the matched object
            matchedObject.fadeTransition(500);

            // runs the fade transition in the contents
            // and updates the state on callback
            contents.fadeTransition(500, function() {
                        // updates the system
                        _update(matchedObject, options);
                    });
        };

        var __moveToThumbnailIndex = function(matchedObject, options) {
            // retrieves the thumbnail index
            var thumbnailIndex = options["thumbnailIndex"];

            // retrieves the sets
            var sets = matchedObject.data("sets");

            // retrieves the sets length
            var setsLength = sets.length;

            // in case the thumbnails index overflows
            if (thumbnailIndex < 0 || thumbnailIndex * 3 >= setsLength) {
                // returns immediately
                return;
            }

            // retrieves the selector
            var selector = matchedObject.data("selector");

            // sets the thumbnail index in the matched object
            matchedObject.data("thumbnailIndex", thumbnailIndex);

            // updates the system
            _update(matchedObject, options);
        };

        var __moveToScreenshotIndex = function(matchedObject, options) {
            // retrieves the screenshot index
            var screenshotIndex = options["screenshotIndex"];

            // sets the screenshot index in the matched object
            matchedObject.data("screenshotIndex", screenshotIndex);

            // updates the screenshot
            _updateScreenshot(matchedObject, options);
        };

        var __updateScreenshotKeyboard = function(event) {
            // retrieves the key code from the event
            var code = event.keyCode ? event.keyCode : event.which;

            // retrieves the slider elemnt
            var slider = jQuery(".jquery-slider");

            // retrieves the screenshot index from the slider
            var screenshotIndex = slider.data("screenshotIndex");

            // retrieves the sets
            var sets = matchedObject.data("sets");

            // retrieves the set index
            var setIndex = matchedObject.data("setIndex");

            // retrieves the current set
            var currentSet = sets[setIndex];

            // retrieves the current set screenshots
            var currentSetScreenshots = currentSet["screenshots"]
                    ? currentSet["screenshots"]
                    : [];

            // retrieves the current set screenshots length
            var currentSetScreenshotsLength = currentSetScreenshots.length;

            // switches over the code
            switch (code) {
                // in case it's the left arrow
                case 37 :
                    // decrements the screenshot index
                    screenshotIndex--;

                    // breaks the switch
                    break;

                // in case it's the right arrow
                case 39 :
                    // increments the screenshot index
                    screenshotIndex++;

                    // breaks the switch
                    break;
            }

            // in case the screenshot index overflows the base value
            if (screenshotIndex < 0
                    || screenshotIndex >= currentSetScreenshotsLength) {
                // returns immediately (overflow)
                return;
            }

            // creates the options map
            var options = {
                screenshotIndex : screenshotIndex
            };

            // moves to the screenshot index
            __moveToScreenshotIndex(slider, options);
        };

        // switches over the method
        switch (method) {
            case "move" :
                // moves to the set index
                _move(matchedObject, options);

                // breaks the switch
                break;

            case "default" :
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
