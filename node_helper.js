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
        var apiEndpoint = "https://query1.finance.yahoo.com/v7/finance/quote";
        var fields = [
            'symbol',
            'regularMarketVolume',
            'regularMarketTime',
            'regularMarketPrice',
            'regularMarketPreviousClose',
            'regularMarketChange',
            'regularMarketChangePercent'
        ];
        var options = {
            method: 'GET',
            url: apiEndpoint,
            qs: {
                'lang': 'en-US',
                'region': 'US',
                'corsDomain': 'finance.yahoo.com',
                'fields': fields.toString(),
                'symbols': cfg.symbols.toString()
            },
            headers: {
                useQuerystring: true
            }
        };
        console.log("[MKTINDEX] Query API for current market summary");
        request(options, (error, response, body)=>{
            var data = null;
            if (error) {
                console.error("[MKTINDEX] API Error: ", error);
                return;
            }
            if (response.statusCode != 200) {
                console.error("[MKTINDEX] Request error: " + response.statusMessage);
                return;
            }
            data = JSON.parse(body);
            //this.log("Received data: " + JSON.stringify(data));
            if (data.hasOwnProperty('quoteResponse')) {
                var results = data.quoteResponse.result;
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
