import { getAsync, getAsyncCMS, postAsync } from "@/helper/request";

export const getINOUser = async ({ ...params }) => {
  return await getAsync(`ino/get-user`, params);
};