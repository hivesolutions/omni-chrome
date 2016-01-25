// Hive Omni ERP
// Copyright (c) 2008-2016 Hive Solutions Lda.
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
// __copyright__ = Copyright (c) 2008-2016 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

var Controller = function() {};

Controller.prototype.render_account = function(data) {
    // retrieves the various options from the local storage
    // to be used in the display
    var oauthToken = localStorage["frontdoor_oauth_token"] || "N/A";
    var sessionId = localStorage["frontdoor_session_id"] || "N/A";

    // creates the list of items that represent the various
    // options to be presented
    var options = [{
        key: "Email",
        value: "joamag@gmail.com"
    }, {
        key: "Password",
        value: "*************"
    }, {
        key: "Session Identifier",
        value: sessionId
    }, {
        key: "OAuth Token",
        value: oauthToken
    }];

    // creates the template handler and assigns the
    // options to the handler and processes the received
    // data as the template contents
    var handler = new TemplateHandler();
    handler.assign("options", options);
    handler.process(data);

    // retrieves the "rendered" value from the handler and
    // converts it into an element
    var value = handler.getValue();
    value = jQuery(value);
    value.addClass("panel-main");

    // retrieves the side panel and insets the element after
    // it (main panel)
    var panelSide = jQuery(".panel-side");
    panelSide.after(value);

    // runs the apply operation on top of the value to render
    // the complete set of components
    value.uxapply();

    // retrieves the clear and refresh settings element
    var clearSettings = jQuery(".clear-settings");
    var refreshSettings = jQuery(".refresh-settings");

    // "saves" the current instance as the current
    // controller in use
    var controller = this;

    // registers for the click event on the clear settings
    // element (button)
    clearSettings.click(function() {
        // sends a request to the background to
        // clear the current data cache
        chrome.extension.sendRequest(null, {
            messageType: "clear"
        }, function(response) {

            controller.change("account");
        });
    });

    // registers for the click event on the clear settings
    // element (button)
    refreshSettings.click(function() {
        controller.change("account");
    });
};

Controller.prototype.render_status = function(data) {
    // creates the template handler processes the
    // received data as the template contents
    var handler = new TemplateHandler();
    handler.process(data);

    // retrieves the "rendered" value from the handler and
    // converts it into an element
    var value = handler.getValue();
    value = jQuery(value);
    value.addClass("panel-main");

    // retrieves the side panel and insets the element after
    // it (main panel)
    var panelSide = jQuery(".panel-side");
    panelSide.after(value);
};

Controller.prototype.change = function(name) {
    // retrieves the main panel and removes it
    // (it's going to be changed)
    var panelMain = jQuery(".panel-main");
    panelMain.remove();

    // creates the complete url value to the template
    // to be used in the loading
    var url = "templates/" + name + ".html.tpl";

    // retrieves the template using a remote call and
    // handles it by calling the appropriate handler
    // in the controller structure
    jQuery.ajax({
        url: url,
        dataType: "text",
        processData: false,
        context: this,
        error: function(request, status, error) {},
        success: function(data) {
            var method = this["render_" + name];
            method.call(this, data);
        }
    });
};

jQuery(document).ready(function() {
    // tenho de utilizar um sistema de templates
    // do ux para renderizar isto como deve de ser
    // criar uma abstracao de troca de pagina para
    // o ux depois ate pode ser utilizada no frontdoor
    // na parte de ajax

    var controller = new Controller();

    var active = jQuery(".menu > .button.active");
    var name = active.attr("data-name");
    controller.change(name);

    jQuery(".menu > .button").click(function() {
        var element = jQuery(this);
        var menu = element.parents(".menu");

        var active = jQuery("> .button.active", menu);
        active.removeClass("active");

        element.addClass("active");

        var name = element.attr("data-name");

        controller.change(name);
    });
});
