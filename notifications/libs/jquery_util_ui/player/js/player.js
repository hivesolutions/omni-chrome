// Hive Colony Framework
// Copyright (C) 2008-2012 Hive Solutions Lda.
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
// __copyright__ = Copyright (c) 2008-2012 Hive Solutions Lda.
// __license__   = Hive Solutions Confidential Usage License (HSCUL)

/**
 * jQuery video plugin, this jQuery plugin is a simple (video) player
 * implementation meant to be used in colony websites.
 *
 * @name jquery-player.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date May 16, 2011
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.player = function(method, options) {
        // the default mini
        var DEFAULT_MINI = false;

        // the default branding url
        var DEFAULT_BRANDING_URL = "http://getcolony.com";

        // the default values for the player
        var defaults = {
            mini : DEFAULT_MINI,
            brandingUrl : DEFAULT_BRANDING_URL
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
            // retrieves the miini option
            var mini = options["mini"];

            // wraps the matched object within the video container
            matchedObject.wrap("<div class=\"jquery-player-video\" />");

            // retrieves the video reference
            var video = matchedObject.parents(".jquery-player-video");

            // wraps the vide reference within the player container
            video.wrap("<div class=\"jquery-player\" />");

            // retrives the player reference
            var player = matchedObject.parents(".jquery-player");

            // appends the extra html code to the player
            player.append("<div class=\"jquery-player-overlay\"></div>"
                    + "<div class=\"jquery-player-loading-overlay\">"
                    + "<div class=\"jquery-player-loading-overlay-contents\">"
                    + "<div id=\"div3\" class=\"jquery-player-loading-overlay-image\"></div>"
                    + "<div class=\"jquery-player-loading-overlay-message\">LOADING</div>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"jquery-player-controls\">"
                    + "<div class=\"jquery-player-button play\"></div>"
                    + "<div class=\"jquery-player-button volume\"></div>"
                    + "<div class=\"jquery-player-button fullscreen\"></div>"
                    + "<div class=\"jquery-player-current-time\">01:01</div>"
                    + "<div class=\"jquery-player-progress\">"
                    + "<div class=\"jquery-player-cursor\"></div>"
                    + "<div class=\"jquery-player-progress-bar\">"
                    + "<div class=\"jquery-player-progress-bar-active\"></div>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"jquery-player-branding\"></div>"
                    + "<div class=\"jquery-player-volume-control\">"
                    + "<div class=\"jquery-player-volume-control-bar\">"
                    + "<div class=\"jquery-player-volume-control-bar-active\"></div>"
                    + "</div>" + "</div>"
                    + "<div class=\"jquery-player-duration\">31:45</div>"
                    + "</div>");

            // retrieves the overlay
            var overlay = jQuery(".jquery-player-overlay", player);

            // retrieves the loading overlay
            var loadingOverlay = jQuery(".jquery-player-loading-overlay",
                    player);

            // retrieves the loading overlay image
            var loadingOverlayImage = jQuery(
                    ".jquery-player-loading-overlay-image", player);

            // retrieves the player controls
            var playerControls = jQuery(".jquery-player-controls", player);

            // sets the initial opacity for the overlay
            overlay.css("opacity", 0.7);

            // registers the video for the resize event
            // using an extra library
            video.resize();

            // starts the loading animation in the loading overlay image
            loadingOverlayImage.loadinganimation();

            // hides the loading overlay
            loadingOverlay.hide();

            // hides the player controls
            playerControls.hide();

            // in case the mini options is set add
            // the mini class
            mini && player.addClass("mini");

            // sets the player attributes
            player.data("started", false);
            player.data("playing", false);
            player.data("audio", true);
            player.data("fullscreen", false);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the branding url
            var brandingUrl = options["brandingUrl"];

            // retrives the player reference
            var player = matchedObject.parents(".jquery-player");

            // retrives the video reference
            var video = jQuery(".jquery-player-video", player);

            // retrieves the overlay
            var overlay = jQuery(".jquery-player-overlay", player);

            // retrieves the player controls
            var playerControls = jQuery(".jquery-player-controls", player);

            // retrieves the video element
            var videoElement = jQuery("video", video);

            // retrieves the play button
            var playButton = jQuery(".jquery-player-button.play", player);

            // retrieves the volume button
            var volumeButton = jQuery(".jquery-player-button.volume", player);

            // retrieves the fullscreen button
            var fullscreenButton = jQuery(".jquery-player-button.fullscreen",
                    player);

            // retrieves the branding (button)
            var branding = jQuery(".jquery-player-branding", player);

            // registers the play button for the click event
            playButton.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        _togglePlay(player, options);
                    });

            // registers the volume button for the click event
            volumeButton.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        _toggleAudio(player, options);
                    });

            // registers the fullscreen button for the click event
            fullscreenButton.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        _toggleFullscreen(player, options);
                    });

            // registers the branding for the click event
            branding.click(function(event) {
                        window.open(brandingUrl);
                    });

            // registers the video element from the modified subtree event
            videoElement.bind("loadedmetadata", function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        // starts the layout
                        _startLayout(player, options);
                    });

            videoElement.bind("waiting", function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        var loadingOverlay = jQuery(
                                ".jquery-player-loading-overlay", player);

                        loadingOverlay.fadeIn(350);
                    });

            videoElement.bind("playing", function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        var loadingOverlay = jQuery(
                                ".jquery-player-loading-overlay", player);

                        loadingOverlay.fadeOut(200);
                    });

            videoElement.bind("canplay", function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        var loadingOverlay = jQuery(
                                ".jquery-player-loading-overlay", player);

                        loadingOverlay.fadeOut(200);
                    });

            // registers the video element from the modified subtree event
            videoElement.bind("DOMSubtreeModified", function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        // starts the layout
                        _startLayout(player, options);
                    });

            // registers the video element from the modified subtree event
            video.resize(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        // starts the layout
                        _startLayout(player, options);
                    });

            // registers the video for the click event
            video.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        // starts toggles playing the video
                        _togglePlay(player, options);
                    });

            // registers the overlay for the click event
            overlay.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element.parents(".jquery-player");

                        // starts playing the video
                        _play(player, options);

                        // fades out the overlay
                        element.fadeOut(200);
                    });

            // registers for the mouse enter event in the player
            player.mouseenter(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element;

                        // retrieves the overlay
                        var overlay = jQuery(".jquery-player-overlay", player);

                        // retrieves the player controls
                        var playerControls = jQuery(".jquery-player-controls",
                                player);

                        // retrieves the started attribute
                        var started = player.data("started");

                        // in case the player is sarted
                        if (started) {
                            // shiws the player controls
                            playerControls.fadeIn(350);
                        }
                        // otherwise the player is not started
                        else {
                            // changes the opacity of the overlay
                            overlay.animate({
                                        opacity : 1.0
                                    }, 250);
                        }
                    });

            // registers for the mouse leave event in the player
            player.mouseleave(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the player
                        var player = element;

                        // retrieves the overlay
                        var overlay = jQuery(".jquery-player-overlay", player);

                        // retrieves the player controls
                        var playerControls = jQuery(".jquery-player-controls",
                                player);

                        // retrieves the started attribute
                        var started = player.data("started");

                        // in case the player is started
                        if (started) {
                            // hides the player controls
                            playerControls.fadeOut(200);
                        }
                        // otherwise the player is not started
                        else {
                            // changes the opacity of the overlay
                            overlay.animate({
                                        opacity : 0.7
                                    }, 250);
                        }
                    });
        };

        var _startLayout = function(player, options) {
            // retrives the video reference
            var video = jQuery(".jquery-player-video", player);

            // retrieves the overlay
            var overlay = jQuery(".jquery-player-overlay", player);

            // retrieves the loading overlay
            var loadingOverlay = jQuery(".jquery-player-loading-overlay",
                    player);

            // retrieves the loading overlay contents
            var loadingOverlayContents = jQuery(
                    ".jquery-player-loading-overlay-contents", player);

            // retrieves the video height
            var videoHeight = video.height();

            // retrieves the loading overlay visible status
            var loadingOverlayVisible = loadingOverlay.is(":visible");

            // in case the loading overlay is not visible show
            // temporarly for measuring purposes
            !loadingOverlayVisible && loadingOverlay.show();

            // retrieves the loading overlay contents height
            var loadingOverlayContentsHeight = loadingOverlayContents.height();

            // in case the loading overlay was not visible
            // hides it again
            !loadingOverlayVisible && loadingOverlay.hide();

            // sets the video height in the overlays
            overlay.height(videoHeight);
            loadingOverlay.height(videoHeight);

            // sets the margin top to compensate the height in
            // the overlays
            overlay.css("marginTop", (videoHeight * -1) + "px");
            loadingOverlay.css("marginTop", (videoHeight * -1) + "px");

            // centers the loading overlay contents using the margin from the video
            // height and the loading overlay contents height
            loadingOverlayContents.css("marginTop",
                    ((videoHeight / 2) - (loadingOverlayContentsHeight / 2))
                            + "px");

            // does the layout of the player
            _doLayout(player, options);
        };

        var _doLayout = function(player, options) {
            // retrieves the player width
            var playerWidth = player.width();

            // retrieves the player controls
            var playerControls = jQuery(".jquery-player-controls", player);

            // retrieves the player controls width
            var playerControlsWidth = playerControls.width();

            // calculates the player controls x position
            var playerControlsX = (playerWidth / 2.0)
                    - (playerControlsWidth / 2.0);

            // sets the player controls x position
            playerControls.css("left", playerControlsX + "px");
        };

        var _togglePlay = function(player, options) {
            // retrieves the player playing status
            var playing = player.data("playing");

            // in case the player is playing (running)
            if (playing) {
                // pauses the player
                _pause(player, options);
            }
            // otherwise the player is paused
            else {
                // plays the player
                _play(player, options);
            }
        };

        var _toggleAudio = function(player, options) {
            // retrieves the player audio status
            var audio = player.data("audio");

            // in case the player has audio
            if (audio) {
                // mutes the player
                _mute(player, options);
            }
            // otherwise the player is muted
            else {
                // sounds the player
                _sound(player, options);
            }
        };

        var _toggleFullscreen = function(player, options) {
            // retrieves the player fullscreen status
            var fullscreen = player.data("fullscreen");

            // in case the player is maximized
            if (fullscreen) {
                // minimize the player
                _minimize(player, options);
            }
            // otherwise the player is minimized
            else {
                // maximizes the player
                _maximize(player, options);
            }
        };

        var _play = function(player, options) {
            // retrieves the video reference
            var video = jQuery("video", player);

            // retrieves the play button
            var playButton = jQuery(".jquery-player-button.play", player);

            // retrieves the video html element
            var videoElement = video.get(0);

            // plays the video
            videoElement.play();

            // adds pause class to the play button
            playButton.addClass("pause");

            // sets the player as playing
            player.data("playing", true);

            // sets the player as started
            player.data("started", true);
        };

        var _pause = function(player, options) {
            // retrieves the video reference
            var video = jQuery("video", player);

            // retrieves the play button
            var playButton = jQuery(".jquery-player-button.play", player);

            // retrieves the video html element
            var videoElement = video.get(0);

            // pauses the video
            videoElement.pause();

            // removes pause class from the play button
            playButton.removeClass("pause");

            // sets the player as paused
            player.data("playing", false);
        };

        var _mute = function(player, options) {
            // retrieves the video reference
            var video = jQuery("video", player);

            // retrieves the volume button
            var volumeButton = jQuery(".jquery-player-button.volume", player);

            // retrieves the video html element
            var videoElement = video.get(0);

            // sets the video as muted
            videoElement.muted = true;

            // add mute class to the volume button
            volumeButton.addClass("mute");

            // sets the player as muted
            player.data("audio", false);
        }

        var _sound = function(player, options) {
            // retrieves the video reference
            var video = jQuery("video", player);

            // retrieves the volume button
            var volumeButton = jQuery(".jquery-player-button.volume", player);

            // retrieves the video html element
            var videoElement = video.get(0);

            // sets the video as non muted
            videoElement.muted = false;

            // removes mute class from the volume button
            volumeButton.removeClass("mute");

            // sets the player as non muted
            player.data("audio", true);
        }

        var _minimize = function(player, options) {
            // retrieves the player controls
            var playerControls = jQuery(".jquery-player-controls", player);

            // retrieves the fullscreen button
            var fullscreenButton = jQuery(".jquery-player-button.fullscreen",
                    player);

            // retrieves the video element from the player
            var video = jQuery("video", player);

            // hides the player controls
            playerControls.hide();

            // triggers the minimize event
            video.trigger("minimize", []);

            // removes shrink class from the fullscreen button
            fullscreenButton.removeClass("shrink");

            // sets the player as non fullscreen
            player.data("fullscreen", false);
        };

        var _maximize = function(player, options) {
            // retrieves the player controls
            var playerControls = jQuery(".jquery-player-controls", player);

            // retrieves the fullscreen button
            var fullscreenButton = jQuery(".jquery-player-button.fullscreen",
                    player);

            // retrieves the video element from the player
            var video = jQuery("video", player);

            // hides the player controls
            playerControls.hide();

            // triggers the maximize event
            video.trigger("maximize", []);

            // add shrink class to the fullscreen button
            fullscreenButton.addClass("shrink");

            // sets the player as non fullscreen
            player.data("fullscreen", true);
        };

        // switches over the method
        switch (method) {
            case "play" :
                // plays the content
                _play(matchedObject, options);

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

(function(jQuery) {
    jQuery.fn.loadinganimation = function(options) {
        // the default values for the loading animation
        var defaults = {};

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
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // starts the rotation for the matched object
            _rotate(matchedObject, 0);
        };

        var _rotate = function(element, count) {
            // iterates over all the elements
            element.each(function(index, element) {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the element reference
                var elementReference = element.get(0);

                // updates the element reference transformations
                elementReference.style.msTransform = "rotate(" + count + "deg)";
                elementReference.style.OTransform = "rotate(" + count + "deg)";
                elementReference.style.MozTransform = "rotate(" + count
                        + "deg)";
                elementReference.style.WebkitTransform = "rotate(" + count
                        + "deg)";

                // in case the rotation overflows
                if (count == 360) {
                    // resets the rotation count
                    count = 0
                }

                // increments the count
                count += 10;

                // sets the timout for the new rotation
                window.setTimeout(function() {
                            _rotate(element, count);
                        }, 30);
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
