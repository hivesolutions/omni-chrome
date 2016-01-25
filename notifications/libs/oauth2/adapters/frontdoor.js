OAuth2.adapter("frontdoor", {
    authorizationCodeURL: function(config) {
        return "https://{{DOMAIN}}.frontdoorhq.com/oauth/authorize?client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&scope={{API_SCOPE}}&response_type=code"
        .replace(
            "{{CLIENT_ID}}", config.clientId).replace("{{REDIRECT_URI}}",
            this.redirectURL(config)).replace("{{API_SCOPE}}",
            config.apiScope).replace("{{DOMAIN}}", config.domain);
    },

    redirectURL: function(config) {
        return "https://app.frontdoorhq.com/resources/css/layout.css";
    },

    parseAuthorizationCode: function(url) {
        var error = url.match(/[\?&]error=([^&]+)&/);
        var errorDescription = url.match(/[\?&]error_description=([^&]+)&/);

        error = error ? decodeURIComponent(error[1]) : null;
        errorDescription = errorDescription ? decodeURIComponent(errorDescription[1]) : null;

        if (error) {
            throw "Error getting authorization code - " + error + " (" + errorDescription + ")";
        }

        return url.match(/[\?&]code=([\w\/\-]+)&/)[1];
    },

    accessTokenURL: function() {
        return "https://api.frontdoorhq.com/oauth/access_token";
    },

    accessTokenMethod: function() {
        return "POST";
    },

    accessTokenParams: function(authorizationCode, config) {
        return {
            code: authorizationCode,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            redirect_uri: this.redirectURL(config),
            grant_type: "authorization_code"
        };
    },

    parseAccessToken: function(response) {
        var parsedResponse = JSON.parse(response);
        return {
            accessToken: parsedResponse.access_token,
            refreshToken: parsedResponse.refresh_token,
            expiresIn: parsedResponse.expires_in
        };
    }
});
