import { sleep } from "crawlee";
import test, { Locator, Page } from "playwright/test";

test("test", async ({ page }) => {
  const group = {
    id: 42,
    name: "IVE",
    name_en: "IVE",
    image:
      "https://d1sut5kn3lwnf7.cloudfront.net/media/group/2022/03/16/1751c11529da4421b0ceaf0663f430be.jpg",
  };

  await page.goto("https://www.music-flo.com/");

  await page.locator("label span").first().click();
  await page.getByRole("button", { name: "팝업 닫기", exact: true }).click();
  await page.getByPlaceholder("검색어를 입력하세요").click();
  await page.getByPlaceholder("검색어를 입력하세요").fill("세븐틴");
  await page.getByPlaceholder("검색어를 입력하세요").press("Enter");
  await page.waitForLoadState();
  await page.getByRole("button", { name: "아티스트" }).click();
  await page.waitForLoadState();
  await page.locator(".thumbnail_list > li").nth(0).click();
  await page.waitForLoadState();
  await page.getByRole("button", { name: "앨범" }).click();
  await page.getByRole("button", { name: "앨범" }).click();

  await page.locator("ul.thumbnail_list").scrollIntoViewIfNeeded();
  await page.locator("#body").press("End");
  await page.waitForLoadState();
  await sleep(2000);

  const count = await page
    .locator("ul.thumbnail_list > li > .badge_area > .badge_track_info")
    .count();
  const albums = await page.locator("ul.thumbnail_list > li").all();

  const temp: any[] = [];
  for (let i = 0; i < count; i++) {
    const album = albums[i];
    const title = await album.locator("p.title").innerText();
    const category = await album
      .locator("span.truncate-two-lines-ellipsis")
      .innerText();
    const date = await album.locator("dd.date").innerText();

    const data = { title, category, date };
    temp.push(data);
    console.log(data);
  }

  // console.log(temp);
});
