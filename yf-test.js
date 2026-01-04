const YahooFinance = require("yahoo-finance2").default;

const fields = [
    'symbol',
    'regularMarketTime',
    'regularMarketPrice',
    'regularMarketPreviousClose',
    'regularMarketChange',
    'regularMarketChangePercent'
];

const symbols = ["^DJI", "^IXIC", "^GSPC", "^TNX", "CL=F", "EURUSD=X"];
async function getQuotes(symbolList) {
    const yahooFinance = new YahooFinance({
      suppressNotices: ["yahooSurvey"],
    });
    const quotes = await yahooFinance.quote(symbolList, {fields: fields},{validateResult: false});
    console.log("Num returned: ", quotes.length);
    return quotes;
}

getQuotes(symbols).then(quotes => {
        console.log("Num items = ", quotes.length);
        quotes.forEach( quote => {
            console.log(quote.symbol, quote.regularMarketPrice, quote.regularMarketPreviousClose,
                quote.regularMarketChange, quote.regularMarketChangePercent);
        });
    })
    .catch(err => {
        console.log("Error: ", err);
    });
