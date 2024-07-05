import { KeyValueStore, sleep } from "crawlee";
import { Page } from "playwright";
import { LABELS } from "../constants/label.js";
import { IResponseType, fetcher } from "../utils/fetcher.js";
import { GroupResponse } from "./interface.js";

export async function AlbumList({ page }: { page: Page }) {
  const { data }: IResponseType<GroupResponse> = await fetcher(
    "https://api.pocamarket.com/card/gb/v1/group"
  );

  const finalArray = [];
  const groupIdList = data.groups;
  // const groupIdList = [
  //   {
  //     id: 42,
  //     name: "twice",
  //     name_en: "IVE",
  //   },
  // ];

  // 그룹에 맞는 전체 앨범 리스트 가져오기
  // for (let i = 0; i < 1; i++) {
  // &Team Izone 라이관린 따로
  const group = groupIdList[4];
  console.log("-----", group.name);
  console.log(group);

  await page.goto("https://www.music-flo.com/");

  await page.locator("label span").first().click();
  await page.getByRole("button", { name: "팝업 닫기", exact: true }).click();
  await page.getByPlaceholder("검색어를 입력하세요").click();
  await page.getByPlaceholder("검색어를 입력하세요").fill(group.name);
  await page.getByPlaceholder("검색어를 입력하세요").press("Enter");
  await page.waitForLoadState();
  await page.getByRole("button", { name: "아티스트" }).click();
  await page.waitForLoadState();
  await page.locator(".thumbnail_list > li").nth(0).click();
  await page.waitForLoadState();
  await page.getByRole("button", { name: "앨범" }).click();
  await page.locator("ul.thumbnail_list").scrollIntoViewIfNeeded();
  await page.locator("#body").press("End");
  await page.waitForLoadState();
  await sleep(1000);

  const count = await page
    .locator("ul.thumbnail_list > li > .badge_area > .badge_track_info")
    .count();
  const albums = await page.locator("ul.thumbnail_list > li").all();

  const temp: any[] = [];
  for (let j = 0; j < count; j++) {
    const album = albums[j];
    const title = await album.locator("p.title").innerText();
    const category = await album
      .locator("span.truncate-two-lines-ellipsis")
      .innerText();
    const date = await album.locator("dd.date").innerText();

    const data = { title, category, date };
    temp.push(data);
    console.log("title", title);
  }

  finalArray.push({ group, albums: temp });
  // console.log("length ", temp.length);
  // }

  const store = await KeyValueStore.open(LABELS.ALBUMLIST);
  await store.setValue(group.name_en.split(" ").join("-"), finalArray);
  // await store.setValue("ANDTEAM", finalArray);
}
