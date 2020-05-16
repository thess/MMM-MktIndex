const request = require('request');
const moment = require('moment');

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

    socketNotificationReceived: function(noti, payload) {
        if (noti == "INIT") {
            this.config = payload;
            console.log("[MKTINDEX] Initialized.");
        } else if (noti == "START") {
            this.scheduleUpdate(15000);
        }
    },

    scheduleUpdate: function(delay = null) {
        // API is limited to 500 requests/day. For the first cycle, 15sec is used.
        // After first cycle, 3min is used for interval to match 500 quota limits.
        // So, one cycle would be 3min * symbol length;
	    var nextLoad = this.config.updateInterval;
	    if (delay !== null && delay >= 0) {
		    nextLoad = delay;
	    }
        setTimeout(() => {
                this.callAPI(this.config, (noti, payload)=>{
                        this.sendSocketNotification(noti, payload);
                })
        }, nextLoad);
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
        this.log("Calling url : " + options.url);

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
        })
        this.scheduleUpdate();
    },

    log: function (msg) {
        if (this.config && this.config.debug) {
            console.log(this.name + ": ", (msg));
        }
    },
})
