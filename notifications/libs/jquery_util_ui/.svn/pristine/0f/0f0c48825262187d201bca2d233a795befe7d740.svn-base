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
 * jQuery slideshow plugin, this jQuery plugin is a simple slideshow
 * implementation meant to be used in http://hive.pt website.
 *
 * @name jquery-slideshow.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.slideshow = function(options) {
        // the default values for the slideshow
        var defaults = {
            height : 440,
            topRatio : 1.40,
            screenshotIndex : 0,
            screenshotsPrefix : "",
            screenshots : []
        };

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
         * Shows the slideshow component.
         */
        var show = function() {
            // retrieves the slideshow overlay
            var slideshowOverlay = jQuery("#jquery-slideshow-overlay");

            // retrieves the slideshow container
            var slideshowContainer = jQuery("#jquery-slideshow-container");

            // retrieves the height
            var height = options["height"];

            // retrieves the offset top ratio
            var topRatio = options["topRatio"];

            // retrieves the matched object top value
            var matchedObjectTop = matchedObject.offset()["top"];

            // calculates the offset to the top based in the
            var offsetTop = matchedObjectTop - (height / topRatio);

            // resizes the overlay
            _resizeOverlay();

            // fades in the overlay
            slideshowOverlay.fadeIn(600);

            // sets the slideshow container position
            slideshowContainer.css("top", offsetTop);

            // shows the slideshow container
            slideshowContainer.show();

            // updates the slideshow
            _update();
        };

        /**
         * Hides the slideshow component.
         */
        var hide = function() {
            // retrieves the slideshow overlay
            var slideshowOverlay = jQuery("#jquery-slideshow-overlay");

            // retrieves the slideshow container
            var slideshowContainer = jQuery("#jquery-slideshow-container");

            // fades out the slideshow overlay
            slideshowOverlay.fadeOut();

            // hides the slideshow container
            slideshowContainer.hide();
        };

        /**
         * Decrements the screenshot index going back to the previous
         * screenshot.
         */
        var previous = function() {
            // retrieves the screenshot index
            var screenshotIndex = options["screenshotIndex"];

            if (screenshotIndex > 0) {
                options["screenshotIndex"]--;
                _update();
            }
        };

        /**
         * Increments the screenshot index going to the next screenshot.
         */
        var next = function() {
            // retrieves the screenshots
            var screenshots = options["screenshots"];

            // retrieves the screenshot index
            var screenshotIndex = options["screenshotIndex"];

            if (screenshotIndex < screenshots.length - 1) {
                options["screenshotIndex"]++;
                _update();
            }
        };

        /**
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {
            // prepends the html slideshow code to the body
            jQuery("body").prepend("<div id=\"jquery-slideshow-container\">"
                    + "<div id=\"jquery-slideshow\">"
                    + "<div id=\"jquery-slideshow-image-area\">" + "</div>"
                    + "<div id=\"jquery-slideshow-control-area\">"
                    + "<div id=\"jquery-slideshow-button-left\"></div>"
                    + "<div id=\"jquery-slideshow-counter\"></div>"
                    + "<div id=\"jquery-slideshow-button-right\"></div>"
                    + "<div id=\"jquery-slideshow-button-close\"></div>"
                    + "</div>" + "</div>" + "</div>")

            // prepends the html overlay code to the body
            jQuery("body").prepend("<div id=\"jquery-slideshow-overlay\"></div>")
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            matchedObject.click(function(event) {
                        // shows the slideshow
                        show();
                    });

            jQuery("#jquery-slideshow-button-left").click(function(event) {
                        // shows the previous screenshot
                        previous();
                    });

            jQuery("#jquery-slideshow-button-right").click(function(event) {
                        // shows the next screenshot
                        next();
                    });

            jQuery("#jquery-slideshow-button-close").click(function(event) {
                        // closes the slideshow
                        hide();
                    });

            jQuery(window).resize(function(event) {
                        // resizes the overlay
                        _resizeOverlay();
                    });
        };

        /**
         * Updates the current slideshow status.
         */
        var _update = function() {
            // retrieves the slideshow image
            var slideshowImage = jQuery("#jquery-slideshow-image");

            // retrieves the slideshow counter
            var slideshowCounter = jQuery("#jquery-slideshow-counter");

            // retrieves the screenshots
            var screenshots = options["screenshots"];

            // retrieves the screenshot index
            var screenshotIndex = options["screenshotIndex"];

            // retrieves the screenshots prefix
            var screenshotsPrefix = options["screenshotsPrefix"];

            // retrieves the current screenshot
            var currentScreenshot = screenshots[screenshotIndex];

            // retrieves the target path
            var targetPath = screenshotsPrefix + currentScreenshot;

            // in case the slideshow image does not exists
            if (slideshowImage.length == 0) {
                // appends the slideshow image
                __appendSlideshowImage();

                // retrieves the slideshow image
                slideshowImage = jQuery("#jquery-slideshow-image");
            }

            // retrieves the current path
            var currentPath = slideshowImage.attr("src");

            // in case the current and the target path are the smae
            if (currentPath == targetPath) {
                // returns immediately
                return;
            }

            // fades out the current image
            slideshowImage.fadeOut(200);

            // sets the current screenshot in the slideshow
            slideshowImage.attr("src", targetPath);

            // sets the label in the slideshow
            slideshowCounter.html(String(screenshotIndex + 1) + " of "
                    + String(screenshots.length));
        };

        /**
         * Callback called uppon the end of the update.
         */
        var _endUpdate = function() {
            // sets the timeout for the fade in
            setTimeout(function() {
                        jQuery("#jquery-slideshow-image").fadeIn(200);
                    }, 200);
        };

        var _resizeOverlay = function() {
            // retrieves the document
            var _document = jQuery(document);

            // retrieves the slideshow overlay
            var slideshowOverlay = jQuery("#jquery-slideshow-overlay");

            // resets the size of the slideshow overlay
            // to avoid problems in the document size
            slideshowOverlay.width(0);
            slideshowOverlay.height(0);

            // retrieves the document dimensions
            var documentWidth = _document.width();
            var documentHeight = _document.height();

            // sets the slideshow overlay dimensions
            slideshowOverlay.width(documentWidth);
            slideshowOverlay.height(documentHeight);
        };

        var __appendSlideshowImage = function(targetPath) {
            // defaults the target path to an empty string
            targetPath = targetPath ? targetPath : "";

            // retrieves the slideshow image area
            var slideshowImageArea = jQuery("#jquery-slideshow-image-area");

            // appends the slideshow image to the slideshow image area
            slideshowImageArea.append("<img id=\"jquery-slideshow-image\" height=\"403\" width=\"780\" src=\""
                    + targetPath + "\" alt=\"\" />");

            // retrieves the slideshow image
            var slideshowImage = jQuery("#jquery-slideshow-image");

            // installs the end update handler
            slideshowImage.imagesLoaded(_endUpdate);
        }

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

(function(jQuery) {
    jQuery.fn.imagesLoaded = function(callback) {
        var elements = this.filter("img");
        var elementsLength = elements.length;

        elements.bind("load", function() {
                    if (--elementsLength <= 0) {
                        callback.call(elements, this);
                    }
                }).each(function() {
                    // cached images don't fire load sometimes
                    if (this.complete || this.complete === undefined) {
                        this.src = this.src;
                    }
                });
    }
})(jQuery);
