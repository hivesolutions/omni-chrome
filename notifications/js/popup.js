// Hive Omni ERP
// Copyright (C) 2008-2012 Hive Solutions Lda.
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
// __copyright__ = Copyright (c) 2008-2012 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

jQuery(document).ready(function() {

    var startSession = function(accessToken, successCallback, errorCallback) {
        // creates a xml http request
        var request = new XMLHttpRequest();

        // requests the start of a new session
        var startSessionUrl = "https://api.frontdoorhq.com/oauth/start_session?access_token="
                + accessToken;
        request.open("GET", startSessionUrl, true);

        // listens for request state changes
        request.onreadystatechange = function() {
            // parses the response in case the request is complete
            if (request.readyState == 4) {
                try {
                    // parses the response
                    var response = JSON.parse(request.responseText);
                } catch (exception) {
                    setError("Problem parsing json response");
                    return;
                }

                // invokes the success callback in case
                // the request was successful
                if (request.status == 200) {
                    var sessionId = response["_session_id"];
                    localStorage["frontdoor_session_id"] = sessionId;

                    // invokes the success callback
                    successCallback(sessionId);
                }
                // otherwise invokes the error callback
                else {
                    // invokes the error callback
                    errorCallback
                            ? errorCallback(response)
                            : setError(response.exception.message);
                }
            }
        };

        request.send(null);
    };

    var getSession = function(callback) {
        // creates a new oauth client for the frontdoor session
        // this should represent an oauth session
        var frontdoorOAuth = new OAuth2("frontdoor", {
            client_id : "9328490d6d154f9aae68e37095179785",
            client_secret : "5e5e119d30dd4d9dabaae22a16b2cb12",
            api_scope : "foundation.log_entrys.list foundation.system_users.show",
            domain : "app"
        }, function(oauthClient) {
            // tries to authorize the acess token using the client, this
            // call will return immediately in case the token is
            // still valid (token cache system)
            oauthClient.authorize(function() {
                        var accessToken = oauthClient.getAccessToken();
                        startSession(accessToken, function(session_id) {
                                    callback(session_id);
                                }, function() {
                                });
                    });
        });
    };

    var getLogEntries = function(sessionId, successCallback, errorCallback) {
        // initializes the xml http request
        var request = new XMLHttpRequest();

        // fetches the latest log entries
        var logEntriesUrl = "https://api.frontdoorhq.com/log_entrys.json?session_id="
                + sessionId;
        request.open("GET", logEntriesUrl, true);

        // listens for request state changes
        request.onreadystatechange = function() {
            // parses the response in case the request is complete
            if (request.readyState == 4) {
                try {
                    // parses the response
                    var response = JSON.parse(request.responseText);
                } catch (exception) {
                    setError("Problem parsing json response");
                    return;
                }

                // invokes the success callback in case
                // the request was successful
                if (request.status == 200) {
                    // invokes the success callback
                    successCallback(response);
                }
                // otherwise invokes the error callback
                else {
                    // invokes the error callback
                    errorCallback
                            ? errorCallback(response)
                            : setError(response.exception.message);
                }
            }
        };

        // sends the request
        request.send(null);
    };

    var createDefaultNotification = function(session_id, logEntry) {
        // defines the message
        var message = "<span>Default Notification</span>"

        // creates the notification
        var notification = {
            message : message
        }

        // returns the notification
        return notification;
    };

    var createCreateSaleNotification = function(session_id, logEntry) {
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
                + logCreateUserObjectId + "/image?session_id=" + session_id
                + "&size=50";

        // defines the message
        var message = "<span href=\"" + entityUrl
                + "\"><span class=\"highlight highlight-blue\">"
                + logEntityRepresentation + "</span> was sold.</span>"

        // creates the notification
        var notification = {
            entity_url : entityUrl,
            image_url : imageUrl,
            message : message
        }

        // returns the notification
        return notification;
    };

    var createEditProductNotification = function(session_id, logEntry) {
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
                + logCreateUserObjectId + "/image?session_id=" + session_id
                + "&size=50";

        // defines the message
        var message = "<span href=\"" + entityUrl
                + "\"><span class=\"highlight highlight-blue\">"
                + logEntityRepresentation + "</span> was edited.</span>"

        // creates the notification
        var notification = {
            entity_url : entityUrl,
            image_url : imageUrl,
            message : message
        }

        // returns the notification
        return notification;
    };

    var createEditProductNotification = function(session_id, logEntry) {
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
                + logCreateUserObjectId + "/image?session_id=" + session_id
                + "&size=50";

        // defines the message
        var message = "<span href=\"" + entityUrl
                + "\"><span class=\"highlight highlight-blue\">"
                + logEntityRepresentation + "</span> was edited.</span>"

        // creates the notification
        var notification = {
            entity_url : entityUrl,
            image_url : imageUrl,
            message : message
        }

        // returns the notification
        return notification;
    };

    var updateNotifications = function() {
        getSession(function(session_id) {
            getLogEntries(session_id, function(logEntries) {
                // removes the notifications currently in the notifications list
                var notificationsList = jQuery(".notifications-list");
                var notificationElements = jQuery("li:not(.template)",
                        notificationsList);
                notificationElements.remove();

                // retrieves the notification template
                var notificationTemplate = jQuery(".notifications-list li.template");

                // converts the log entries to notifications
                // and adds them to the notifications list
                for (var index = 0; index < logEntries.length; index++) {
                    // retrieves the log entry
                    var logEntry = logEntries[index];

                    // retrieves the log action and name
                    var logAction = logEntry["action"];
                    var logEntityName = logEntry["entity_name"];

                    // initializes the notification creation method
                    var notificationCreationMethod = null;

                    // notifies the log entry
                    switch (logAction) {
                        case "create" :
                            switch (logEntityName) {
                                case "Sale" :
                                    // sets the notification creation method
                                    // as the create edit product notification
                                    notificationCreationMethod = createCreateSaleNotification;
                                    break;
                            }

                        case "edit" :
                            switch (logEntityName) {
                                case "Product" :
                                    // sets the notification creation method
                                    // as the create edit product notification
                                    notificationCreationMethod = createEditProductNotification;
                                    break;
                            }

                        default :
                            // sets the notification creation method
                            // as the create edit product notification
                            notificationCreationMethod = createDefaultNotification;
                    }

                    // continues in case no notification
                    // creation method was retrieved, meaning
                    // that the log entry cannot be converted
                    // to a notification
                    if (notificationCreationMethod == null) {
                        // continues to the next log entry
                        continue;
                    }

                    // converts the log entry to a notification
                    // and retrieves its entity url
                    var notification = notificationCreationMethod(session_id,
                            logEntry);
                    var notificationEntityUrl = notification["entity_url"];

                    // creates the notification template item
                    // by applying the notification to the template
                    var notificationTemplateItem = notificationTemplate.uxtemplate(
                            notification, {
                                apply : false
                            });

                    // opens a browser tab with the entity
                    // displayed in the notification
                    notificationTemplateItem.click(function() {
                                // creates a new tab with the notification
                                chrome.tabs.create({
                                            url : notificationEntityUrl
                                        }, function(tab) {
                                            // closes the window
                                            window.close();
                                        });
                            });

                    // adds the notification template
                    // item to the notifications list
                    notificationsList.append(notificationTemplateItem);
                }

                // unsets the loading mask to show the contents
                // in the body of the viewport
                unsetLoading();

                // sends a request to the background to reset
                // the unread notifications count since the
                // unread notifications have now been read
                chrome.extension.sendRequest({
                            messageType : "resetUnread"
                        });
            });
        });
    };

    var clearStorage = function() {
        // clears the local storage so that
        localStorage.clear();

        // clears the global oauth structures, avoids
        // possible memory corruption
        OAuth2.adapters = {};
        OAuth2.adapterReverse = {};

        // deletes the reference to the oauth callback
        delete window["oauth-callback"];

        // prints an alert message
        alert("Local storage cleared");
    };

    var setError = function(error) {
        // retrieves the body and error message
        // reference elements to change them
        var _body = jQuery("body");
        var errorMessage = jQuery(".error-message");

        // sets the contents in the error message
        errorMessage.html("Error - " + error);

        // removes the various state classes and sets
        // the current state as error
        _body.removeClass("loading");
        _body.addClass("error");
    };

    var unsetLoading = function(error) {
        // retrieves the body element and then
        // removes the loading class from it
        var _body = jQuery("body");
        _body.removeClass("loading");
    };

    // opens a new tab with the log entries list
    // when the see all notifications link is clicked
    var seeAllNotifications = jQuery(".see-all-notifications");
    seeAllNotifications.click(function() {
                // creates a new tab with the log entries list
                chrome.tabs.create({
                            url : "https://app.frontdoorhq.com/log_entrys"
                        }, function(tab) {
                            // closes the window
                            window.close();
                        });
            });

    // updates the notifications
    updateNotifications();
});
