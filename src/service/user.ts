import { getAsync, postAsync } from "@/helper/request";
import AxiosInstance from "./api";

export const getUserNFT = async (id: any, params?: any) => {
  return await getAsync(`/user/nft/${id}`, params);
};

export const getUserPro5 = async ({ address, ...params }: any) => {
  try {
    const response = await getAsync(`/user/profile/${address}`, params);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
  return { data: [], meta: {} };
};

export const getUserOfferApi = async (params: {
  type: any;
  category: any;
  networkType: number;
  page: number;
  limit: number;
  walletAddress: any;
}) => {
  const response = await AxiosInstance.get("/user/get-offer", { params });
  const { data } = response;
  return data;
};
