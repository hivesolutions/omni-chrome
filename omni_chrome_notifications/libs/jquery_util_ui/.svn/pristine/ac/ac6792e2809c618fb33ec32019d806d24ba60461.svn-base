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

(function($) {
    jQuery.fn.fadeTransition = function(time, callback) {
        // the fade minimum opacity
        var FADE_MINIMUM_OPACITY = 0.15;

        // sets the jquery matched object
        var matchedObject = this;

        // calculates the time slots
        var downTimeSlot = time * 0.3;
        var stopTimeSlot = time * 0.1;
        var upTimeSlot = time * 0.6;

        // animates the opacity to a low level
        matchedObject.animate({
                    "opacity" : FADE_MINIMUM_OPACITY
                }, downTimeSlot, function() {
                    setTimeout(function() {
                                // returns the opacity back to normal
                                matchedObject.animate({
                                            "opacity" : 1.0
                                        }, upTimeSlot);

                                // calls the callback in case it
                                // is defined
                                callback && callback();
                            }, stopTimeSlot);
                });

        // returns the object
        return this;
    };
})(jQuery);
