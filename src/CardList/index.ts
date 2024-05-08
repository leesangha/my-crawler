import { KeyValueStore } from "crawlee";
import { Page } from "playwright";
import { LABELS } from "../constants/label.js";
import { IResponseType, fetcher } from "../utils/fetcher.js";
import { GroupResponse } from "./interface.js";

export async function CardList({ page }: { page: Page }) {
  const { data }: IResponseType<GroupResponse> = await fetcher(
    "https://api.pocamarket.com/card/gb/v1/group"
  );

  const groupIdList = data.groups.filter((group) => group.id === 21);
  // const groupIdList = [21];
  console.log("groupList", groupIdList);

  // 그룹에 맞는 전체 앨범 리스트 가져오기
  for (let i = 0; i < groupIdList.length; i++) {
    const group = groupIdList[i];
    await page.goto("https://melon.com");

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
    const albumTitle = _locator.locator("dt");

    console.log(albumCount);
    for (let j = 0; j < albumCount; j++) {
      const album = albumArray[j].locator("> dd");
      const data = await album.allInnerTexts();
      console.log(data);
    }
  }

  const store = await KeyValueStore.open(LABELS.CARDLIST);
  await store.setValue(LABELS.CARDLIST, data);
}
