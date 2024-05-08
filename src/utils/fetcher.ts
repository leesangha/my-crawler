export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export interface IResponseType<T> {
  success: boolean;
  code: string;
  data: T;
}
