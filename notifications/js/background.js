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

    // the current number of unread notifications
    var unreadNotificationsCount = 0;

    var clearStorage = function() {
        // clears the local storage so that
        localStorage.clear();

        // prints an alert message
        alert("Local storage cleared");
    };

    var setUnreadNotifications = function(notificationsCount) {
        // updates the current notifications count
        unreadNotificationsCount = notificationsCount;

        // defines the badge text
        var badgeText = notificationsCount ? String(notificationsCount) : "";

        // updates the browser action badge with the new notifications count
        chrome.browserAction.setBadgeText({
                    text : badgeText
                });
    };

    var notifyEditProduct = function(logEntry) {
        // retrieves the message attributes
        var logCreateDate = logEntry["create_date"];
        var logCreateUser = logEntry["create_user"];
        var logCreateUserObjectId = logCreateUser["object_id"];
        var logEntity = logEntry["entity"];
        var logEntityObjectId = logEntity["object_id"];
        var logEntityRepresentation = logEntity["representation"];

        // defines the entity url and the image url
        var entityUrl = "https://app.frontdoorhq.com/ivm/products/"
                + logEntityObjectId;
        var imageUrl = "https://api.frontdoorhq.com/system_users/"
                + logCreateUserObjectId + "/image?size=50";

        // defines the message
        var message = "<span href=\"" + entityUrl
                + "\"><span class=\"highlight highlight-blue\">"
                + logEntityRepresentation + "</span> was edited.</span>"

        // encodes the notification parameters
        entityUrl = encodeURIComponent(entityUrl);
        imageUrl = encodeURIComponent(imageUrl);
        message = encodeURIComponent(message);

        // updates the unread notifications count
        setUnreadNotifications(unreadNotificationsCount + 1);

        // creates a notification with the message (passing the arguments
        // as get arguments in the url) and then shows it
        var notificationUrl = "notification.html?entity_url=" + entityUrl
                + "&image_url=" + imageUrl + "&message=" + message;
        var notification = webkitNotifications.createHTMLNotification(notificationUrl);
        notification.show();
    };

    var messageProcessor = function(data) {
        // parses the data retrieving the json
        var logEntry = jQuery.parseJSON(data);

        // retrieves the log action and name
        var logAction = logEntry["action"];
        var logEntityName = logEntry["entity_name"];

        // notifies the log entry
        switch (logAction) {
            case "edit" :
                switch (logEntityName) {
                    case "Product" :
                        // notifies the edit product action
                        notifyEditProduct(logEntry);
                        break;
                }
                break;
        }
    };

    // retrieves the body element
    var _body = jQuery("body");

    // starts the communication to listen for notifications broadcasted by omni
    // this should be able to receive the complete set of messages that respect
    // the current user filtering
    _body.communication("default", {
                url : "https://api.frontdoorhq.com/communication",
                timeout : 500,
                callbacks : [messageProcessor]
            });

    // listens for messages from the current extension
    chrome.extension.onRequest.addListener(
            function(request, sender, sendResponse) {
                // starts the value to be used as the return
                // value in the callback function
                var value;

                switch (request.messageType) {
                    case "resetUnread" :
                        value = setUnreadNotifications(0);
                        break;

                    case "decreaseUnread" :
                        value = setUnreadNotifications(unreadNotificationsCount
                                - 1);
                        break;

                    case "clear" :
                        value = clearStorage();
                        break;
                }

                // sends the response back to the callback
                // handler to notify it about the corrent
                // handling of the event
                sendResponse(value);
            });
});
