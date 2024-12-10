# MMM-MktIndex
MagicMirror module for displaying market indicies using Yahoo Finance Quotes.

**Note:** Module currently assumes the US Eastern time-zone calculating market open times and locales.

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
After installation, you can use this simple test applet to verify that you can get results from the Yahoo Finance site.

```shell
node yf-test.js
```
## API Key
None required.

## Configuration
### Simple
```javascript
{
  //disabled: true,
  module: "MMM-MktIndex",
  position: "top_right",
  config: {
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
    timeFormat: "DD-MM HH:mm",
    symbols: ["^DJI", "^IXIC", "^GSPC", "^TNX", "CL=F", "EURUSD=X"],
    // Label name for each symbol. When you use `alias`, the number of symbols and aliases should be the same.
    // If value is null or "", symbol string will be used by default.
    alias: ["DOW 30", "Nasdaq", "S&P 500", "10yr Bond", "Crude Oil", "EUR/USD"],
    updateInterval: 180,    // Query interval in seconds
  }
},
```
