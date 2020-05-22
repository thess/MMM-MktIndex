# MMM-MktIndex
MagicMirror module for displaying market indicies using Yahoo Finance via RapidAPI.

Currently only works in the US Eastern time-zone calculating market open times.

## Screenshot
- `Example (Using defaults)`<br />
![ScreenShot of Table](https://raw.githubusercontent.com/thess/MMM-MktIndex/master/idx_table.png)


## Installation
```shell
cd ~/MagicMirror/modules
git clone https://github.com/thess/MMM-MktIndex
cd MMM-MktIndex
npm install
```

## RapidAPI Key
https://www.rapidapi.com/

**Note:** Free account has a limit of 500 requests per month which works out to approximately 16/day. Quotes are retrieved every 30min only when market is open.

## Configuration
### Simple
```javascript
{
  //disabled: true,
  module: "MMM-MktIndex",
  position: "top_right",
  config: {
    apiKey : "YOUR-RAPIDAPI-KEY",
    apiQuota: 16,
    timeFormat: "YYYY-MM-DD HH:mm:ss"
  }
},
```
### Details and Defaults Values
```javascript
{
  module: "MMM-MktIndex",
  position: "top_right",
  config: {
    apiKey : "YOUR-RAPIDAPI-KEY", // https://www.rapidapi.com/
    apiQuota: 16, // Daily quota if using free account limit to 500/month
    timeFormat: "DD-MM HH:mm",
    symbols: ["^DJI", "^IXIC", "^GSPC", "^TNX", "CL=F", "EURUSD=X"],
    // Label name for each symbol. When you use `alias`, the number of symbols and aliases should be the same.
    // If value is null or "", symbol string will be used by default.
    alias: ["DOW 30", "Nasdaq", "S&P 500", "10yr Bond", "Crude Oil", "EUR/USD"],
  }
},
```
