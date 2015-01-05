// Hive Omni ERP
// Copyright (C) 2008-2015 Hive Solutions Lda.
//
// This file is part of Hive Omni ERP.
//
// Hive Omni ERP is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Hive Omni ERP is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Hive Omni ERP. If not, see <http://www.gnu.org/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt> & Tiago Silva <tsilva@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2015 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

jQuery(document).ready(function() {
            // retrieves the log attributes from the url
            var url = window.location.href;
            var match = url.match(/[\?]entity_url=(.*)&image_url=(.*)&message=(.*)/);
            var entityUrl = match[1];
            var imageUrl = match[2];
            var message = match[3];

            // decodes the notification parameters
            var entityUrl = decodeURIComponent(entityUrl);
            var imageUrl = decodeURIComponent(imageUrl);
            var message = decodeURIComponent(message);

            // retrieves the elements where the log attributes will be set
            var notificationImage = jQuery(".notification-image > img");
            var notificationDescriptionSpan = jQuery(".notification-description");

            // sets the notification image source as the image url
            notificationImage.attr("src", imageUrl);

            // parses the message and adds it to the
            // notification description span
            var messageElement = jQuery(message);
            notificationDescriptionSpan.append(messageElement);

            // opens a browser tab with the entity displayed
            // in the notification when its clicked
            var notification = jQuery(".notifications-list .button");
            notification.click(function() {
                        // creates a new tab with the
                        // notification entity
                        chrome.tabs.create({
                                    url : entityUrl
                                }, function(tab) {
                                    // sends a request to decrease the
                                    // number of unread notifications
                                    // since a notification has now been read
                                    chrome.extension.sendRequest({
                                                messageType : "decreaseUnread"
                                            });

                                    // closes the window
                                    window.close();
                                });
                    });

            // closes the notification window after the timeout
            setTimeout(function() {
                        // closes the notification window
                        window.close();
                    }, 20000);

            // retrieves the body element and show it ad the end
            // of the loading, this ensures that the height of
            // notification remains correct
            var _body = jQuery("body");
            _body.show();
        });
