// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from "crawlee";
import { router } from "./routes.js";
import { LABELS } from "./constants/label.js";
import dotenv from "dotenv";
dotenv.config();

// const startUrls = ["https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"];
const startUrls = [
  // {
  //   url: "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies",
  //   label: LABELS.TICKERS,
  // },
  // {
  //   url: "https://edition.cnn.com/markets/fear-and-greed",
  //   label: LABELS.FEARANDGREED,
  // },
  // {
  //   url: "https://m.stock.naver.com/worldstock/index/.VIX/total",
  //   label: LABELS.VIX,
  // },
  { url: "https://github.com" },
];

const crawler = new PlaywrightCrawler({
  launchContext: {
    launchOptions: { headless: true },
  },
  requestHandler: router,
  maxRequestsPerCrawl: 20,
});

await crawler.run(startUrls);
