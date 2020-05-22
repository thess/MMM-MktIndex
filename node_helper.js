const request = require('request');

var NodeHelper = require("node_helper");

String.prototype.hashCode = function() {
    var hash = 0
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}

module.exports = NodeHelper.create({
    start: function() {
        this.config = null;
    },

    socketNotificationReceived: function(notifyID, payload) {
        if (notifyID == "INIT") {
            this.config = payload;
            console.log("[MKTINDEX] Initialized.");
        } else if (notifyID == "UPDATE") {
            // Query immediately
            this.callAPI(this.config, (notifyID, payload) => {
                this.sendSocketNotification(notifyID, payload);
            })
        }
    },

    callAPI: function(cfg, callback) {
        var options = {
          method: 'GET',
          url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-summary',
          qs: {region: 'US', lang: 'en'},
          headers: {
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            'x-rapidapi-key': cfg.apiKey,
            useQueryString: true
          }
        };
        console.log("[MKTINDEX] Query API for current market summary");
        request(options, (error, response, body)=>{
            var data = null;
            if (error) {
                console.error("[MKTINDEX] API Error: ", error);
                return;
            }
            data = JSON.parse(body);
            //this.log("Received data: " + JSON.stringify(data));
            if (data.hasOwnProperty("message")) {
                console.error("[MKTINDEX] Error:", data["message"]);
            } else if (data.hasOwnProperty("marketSummaryResponse")) {
		        var results = data.marketSummaryResponse.result;
		        if (results.length == 0) {
                    console.log("[MKTINDEX] Data Error: There is no available data");
                } else {
                    this.log("Sending result: " + results.length + " items");
                    callback('UPDATE', results);
                }
    	    }
        });
    },

    log: function (msg) {
        if (this.config && this.config.debug) {
            console.log(this.name + ": ", (msg));
        }
    },
})
