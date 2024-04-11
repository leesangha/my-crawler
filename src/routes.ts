import { Dataset, KeyValueStore, createPlaywrightRouter } from "crawlee";
import { LABELS } from "./constants/label.js";

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({}) => {});

router.addHandler(LABELS.TICKERS, async ({ page, log }) => {
  const title = await page.title();
  log.info(`title ${title}`);

  // site sub
  const target = await page.locator("#constituents > tbody > tr").all();
  const length = await page.locator("#constituents > tbody > tr").count();
  log.info("target");

  const headers = [
    "Symbol",
    "Security",
    "GICS Sector",
    "GICS Sub-Industry",
    "Headquaters Location",
    "Date added",
    "CIK",
    "Founded",
  ];

  const arr: any[] = [];

  for (let i = 0; i < length; i++) {
    log.info(`line  :${i}`);
    const tdArray = await target[i].locator("td").all();
    const len = await target[i].locator("td").count();

    const data: Record<string, string> = {};

    for (let j = 0; j < len; j++) {
      data[headers[j]] = await tdArray[j].innerText();
    }
    arr.push(data);
  }

  const store = await KeyValueStore.open("TICKERS");
  await store.setValue("SNP500", arr);
});

router.addHandler(LABELS.FEARANDGREED, async ({ page, log }) => {
  const index = await page
    .locator(
      "body > div.layout__content-wrapper.layout-with-rail__content-wrapper > section.layout__wrapper.layout-with-rail__wrapper > section.layout__main-wrapper.layout-with-rail__main-wrapper > section.layout__main.layout-with-rail__main > div > section > div.market-tabbed-container > div.market-tabbed-container__content > div.market-tabbed-container__tab.market-tabbed-container__tab--1 > div > div.market-fng-gauge__overview > div.market-fng-gauge__historical > div.market-fng-gauge__historical-item.market-fng-gauge__historical-item--prevClose > div.market-fng-gauge__historical-item-index > div.market-fng-gauge__historical-item-index-value"
    )
    .innerText();

  log.info("FEAR AND GREED");
  console.log("indexes", index);
  const store = await KeyValueStore.open("FEARANDGREED");
  await store.setValue("INDEX", index);
});

router.addHandler(LABELS.VIX, async ({ page }) => {
  const target = await page
    .locator(
      "#content > div.StockInfo_article__2fBr3.StockInfo_articleIndex__2H7fg > ul > li:nth-child(1) > div > span"
    )
    .innerHTML();

  const store = await KeyValueStore.open(LABELS.VIX);
  await store.setValue(LABELS.VIX, { value: target });
});
