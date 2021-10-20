const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

async function getFloorInfo(slug, mode = "headless") {
  const browser = await puppeteer.launch({
    headless: mode === "debug" ? false : true,
    args: ['--start-maximized'],
  });
  const page = await browser.newPage();
  page.on('console', consoleMessageObject => function (consoleMessageObject) {
    if (consoleMessageObject._type !== 'warning') {
      console.debug(consoleMessageObject._text)
    }
  });
  await page.goto(`https://testnets.opensea.io/collection/${slug}?search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW`);
  await page.waitForTimeout(5);
  const floorInfo = await page.evaluate(() => {
    // const cardsNodeList = document.querySelectorAll(".Asset--anchor .AssetCardFooter--price-amount");
    const cardsNodeList = document.querySelectorAll(".AssetSearchList--asset");
    const cardsArray = Array.prototype.slice.call(cardsNodeList);
    const floorList = cardsArray.map(card => {
      try {
        // only fetch price in ETH
        // if (!card.querySelector(".Price--eth-icon")) {
        //   return undefined;
        // }
        const priceStr = card.querySelector(".Price--amount").textContent;
        const url = card.querySelector(".Asset--anchor").getAttribute('href');
        // return Number(priceStr.split(",").join("."));
        return {
          priceStr,
          url
        };
      } catch (err) {
        return {};
      }
    }).filter(val => val);
    if (floorList.length === 0) {
      return undefined;
    } else {
      floorList.sort(function (a, b) {
        return a.priceStr.localeCompare(b.priceStr);
      });
      return {
        price: floorList[0].priceStr,
        url: floorList[0].url
      };
    }
    // sometimes the order of elements is not accurate on Opensea,
    // thats why we need to minimize get the lowest value
    // IMPORTANT: spread operator is needed for Math.min() to work with arrays
    // return Math.min(...floorPrices);
  });

  if (mode !== "debug") {
    await browser.close();
  }
  return floorInfo;
}

module.exports = {
  getFloorInfo
}
