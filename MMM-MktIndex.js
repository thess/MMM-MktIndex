String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

const header = ["symbol", "price", "close", "change", "changeP"]
const headerTitle = ["Symbol", "Cur.Price", "Prev.Close", "CHG", "CHG%"]

Module.register("MMM-MktIndex", {
  defaults: {
    apiKey: "",
    timeFormat: "DD-MM HH:mm",
    symbols: ["^DJI", "^IXIC", "^GSPC", "^TNX", "CL=F", "EURUSD=X"],
    alias: ["DOW 30", "Nasdaq", "S&P 500", "10yr Bond", "Crude Oil", "EUR/USD"],
    updateInterval: 3 * 60 * 1000,
    debug: false,
  },

  getStyles: function() {
    return ["MMM-MktIndex.css"]
  },

  start: function() {
    this.sendSocketNotification("INIT", this.config);
    this.isStarted = false;
  },

  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.id = "MKTINDEX";
    return wrapper;
  },

  prepare: function() {
      this.prepareTable();
  },

  getStockName: function(symbol) {
    var stockAlias = symbol;
    var i = this.config.symbols.indexOf(symbol);
    if (this.config.symbols.length == this.config.alias.length) {
      stockAlias = (this.config.alias[i]) ? this.config.alias[i] : stockAlias;
    }
    return stockAlias;
  },

  prepareTable: function() {
    var wrapper = document.getElementById("MKTINDEX");
    wrapper.innerHTML = "";

    var tbl = document.createElement("table");
    tbl.id = "MKTINDEX_TABLE";
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    for (i in header) {
      var td = document.createElement("td");
      td.innerHTML = headerTitle[i];
      td.className = header[i];
      tr.appendChild(td)
    };
    thead.appendChild(tr);
    tbl.appendChild(thead);

    for (i in this.config.symbols) {
      var stock = this.config.symbols[i];
      var hashId = stock.hashCode();
      var tr = document.createElement("tr");
      tr.className = "stock";
      tr.id = "STOCK_" + hashId;
      for (j in header) {
        var td = document.createElement("td");
        var stockAlias = this.getStockName(stock);
        td.innerHTML = (j != 0) ? "---" : stockAlias;
        td.className = header[j];
        td.id = header[j] + "_" + hashId;
        tr.appendChild(td);
      }
      tbl.appendChild(tr);
    }
    wrapper.appendChild(tbl);
    var tl = document.createElement("div");
    tl.className = "tagline";
    tl.id = "MKTINDEX_TAGLINE";
    tl.innerHTML = "Last updated: ";
    wrapper.appendChild(tl);
  },

  notificationReceived: function(noti, payload) {
    if (noti == "DOM_OBJECTS_CREATED") {
      this.sendSocketNotification("START");
      this.prepare();
    }
  },

  socketNotificationReceived: function(noti, payload) {
    if (noti == "UPDATE") {
      var numItems = payload.length;
      for (var i= 0; i < numItems; i++) {
	    var item = payload[i];
	    if (item.hasOwnProperty('symbol')) {
	      if (this.config.symbols.indexOf(item.symbol) >= 0) {
             this.log("UPDATING: " + item.symbol);
             this.update(item);
	      }
	    }
      }
    }
  },

  update: function(item) {
      var stock = {
        "symbol": item.symbol,
        "price": item.regularMarketPrice.fmt,
        "close": item.regularMarketPreviousClose.fmt,
        "change": item.regularMarketChange.fmt,
        "changeP": item.regularMarketChangePercent.fmt,
        "requestTime": moment().format(this.config.timeFormat),
        "hash": item.symbol.hashCode()
      }
      this.drawTable(stock);
  },

  drawTable: function(stock) {
    var hash = stock.hash;
    var tr = document.getElementById("STOCK_" + hash);
    var ud = "";
    for (j = 1 ; j <= 4 ; j++) {
      var tdId = header[j] + "_" + hash;
      var td = document.getElementById(tdId);
      td.innerHTML = stock[header[j]];
      td.className = header[j];
      if (header[j] == "change") {
        if (stock[header[j]] > 0) {
          ud = "up";
        } else if (stock[header[j]] < 0) {
          ud = " down";
        }
      }
    }
    tr.className = "animated stock " + ud;
    var tl = document.getElementById("MKTINDEX_TAGLINE");
    tl.innerHTML = "Last updated: " + stock.requestTime;
    setTimeout(()=>{
      tr.className = "stock " + ud;
    }, 1500);
  },

  
  log: function (msg) {
    if (this.config && this.config.debug) {
      console.log(this.name + ": ", (msg));
    }
  },
});
