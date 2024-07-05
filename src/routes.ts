import { KeyValueStore, createPlaywrightRouter } from "crawlee";
import { LABELS } from "./constants/label.js";
import { Page } from "playwright";
import { CardList } from "./CardList/index.js";
import { AlbumList } from "./AlbumList/index.js";

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ page }) => {
  const email: string = process.env.TEST_EMAIL as string;
  const password: string = process.env.TEST_PASSWORD as string;

  await page.goto("https://github.com/");
  await page.getByRole("link", { name: "Sign in" }).click();
  await page.getByLabel("Username or email address").click();

  await page.getByLabel("Username or email address").fill(email);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();

  await page.goto("https://vercel.com/login?next=%2Finfludeo");
  await page.getByTestId("login/github-button").click();
  await page.waitForURL("https://vercel.com/infludeo");
  await page.goto(
    "https://vercel.com/infludeo/react-global-web-prod/analytics"
  );
  await page.waitForURL(
    "https://vercel.com/infludeo/react-global-web-prod/analytics"
  );

  // filter 24시간 단위로 분리
  await page.selectOption(
    "body > div > main > div > section > div > div:nth-child(1) > header > div > div > div > div.stack.self-stretch > div > div.stack > label:nth-child(2)",
    "24h"
  );
  await page.waitForLoadState();

  // Operation Systems
  await page
    .locator(
      "body > div > main > div > section > div > div.relative.flex-1 > div > div > div > div > div.stack > div:nth-child(2) > div:nth-child(2) > button"
    )
    .click();

  // 추출
  const _locator = page.locator(
    ".tailwind > div > div.flex.flex-col.my-2 > button"
  );
  const dt = await _locator.all();
  const count = await _locator.count();

  const OS_Headers = ["Operating Systems", "VISITORS", "PAGE VIEWS"];
  let inner = {};
  for (let i = 0; i < count; i++) {
    const innerData = await dt[i].locator("p").allInnerTexts();
    inner = { ...inner, [i]: innerData };
  }

  // 저장
  const store = await KeyValueStore.open("OPERATING_SYSTEM");
  await store.setValue("OPERATING_SYSTEM", inner);
  // 종료
  await page.getByText("close").click();

  // Browsers
  await page
    .locator(
      "body > div > main > div > section > div > div.relative.flex-1 > div > div > div > div > div.stack > div:nth-child(2) > div:nth-child(3) > button"
    )
    .click();
  await page.waitForLoadState();
  const __locator = page.locator(
    "div.geist-overlay.tailwind > div > div > div > div:nth-child(1) > div.my-2 > div > div"
  );
  const browser_locator = __locator.locator("> div");
  const browser_data = await browser_locator.all();
  const browser_count = await browser_locator.count();

  const Browsers_Headers = ["Browsers", "VISITORS", "PAGE VIEWS"];
  let browser_inner = {};
  for (let i = 0; i < browser_count; i++) {
    console.log("browser crawl[", i, "]");
    const innerData = await browser_data[i].locator("p").allInnerTexts();
    browser_inner = { ...browser_inner, [i]: innerData };
  }
  const browser_store = await KeyValueStore.open("Browsers");
  await browser_store.setValue("Browsers", browser_inner);
  await page.getByText("close").click();
});

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

router.addHandler(LABELS.CARDLIST, CardList);

router.addHandler(LABELS.ALBUMLIST, AlbumList);
