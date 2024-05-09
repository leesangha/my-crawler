import { KeyValueStore } from "crawlee";
import { Page } from "playwright";
import { LABELS } from "../constants/label.js";
import { IResponseType, fetcher } from "../utils/fetcher.js";
import { GroupResponse } from "./interface.js";

export async function CardList({ page }: { page: Page }) {
  const { data }: IResponseType<GroupResponse> = await fetcher(
    "https://api.pocamarket.com/card/gb/v1/group"
  );

  const finalArray = [];
  const groupIdList = data.groups;
  // const groupIdList = [];

  // 그룹에 맞는 전체 앨범 리스트 가져오기
  for (
    let i = Math.floor(groupIdList.length / 2);
    i < groupIdList.length;
    i++
  ) {
    const group = groupIdList[i];

    await page.goto("https://www.melon.com/index.htm");
    await page.getByRole("textbox", { name: "검색 입력 편집창" }).click();
    await page
      .getByRole("textbox", { name: "검색 입력 편집창" })
      .fill(group.name);
    await page.getByRole("button", { name: "검색" }).click();
    await page.waitForLoadState();
    await page.getByRole("link", { name: "앨범", exact: true }).click();
    await page.waitForLoadState();

    // 텍스트 정보 가져오기
    const _locator = page.locator("dl");
    const albumArray = await _locator.all();
    const albumCount = await _locator.count();

    console.log("--> crawl start", group.name);
    // 앨범 타입
    // const albumType = await _locator.locator(".vdo_name").innerText();
    // console.log(albumType);
    const kvDataArray = [];

    for (let j = 0; j < albumCount; j++) {
      const target = albumArray[j];
      const _album_info = target.locator("dt");
      const album = target.locator("dd.btn_play");

      // 앨범 타입
      const albumType = await _album_info.locator(".vdo_name").innerText();

      // 앨범 이름
      const albumTitle = await _album_info.locator("a").innerText();

      // 아티스트 이름
      const artistName = await target
        .locator(".checkEllipsisSearchAlbum")
        .innerText();

      // 곡 명
      const songName = await album.locator(".songname12").innerText();

      // 발매일
      const date = await target.locator("span.cnt_view").innerText();

      // 곡 수
      const nums = await target.locator("span.tot_song").innerText();

      const data = {
        type: albumType,
        title: albumTitle,
        name: artistName,
        title_song: songName,
        date,
        song_count: nums,
      };

      kvDataArray.push(data);
    }
    finalArray.push({ group, albums: kvDataArray });
  }

  const store = await KeyValueStore.open(LABELS.CARDLIST);
  await store.setValue(LABELS.CARDLIST, finalArray);
}
