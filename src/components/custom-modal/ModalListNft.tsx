import IconVerified from "@/assets/icons/IconVerified";
import {
  STARKNET_OFFSET,
  STARKNET_STRK_MARKET_CONTRACT_NEW
} from "@/constants";
import useStarknet from "@/hooks/useStarknet";
import { formatBalanceByChain, getCurrencyByChain } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import CustomModal from ".";
import CustomImage from "../custom-image";
import CustomInput from "../input";
import BigNumber from "bignumber.js";
import StrkToken from "public/images/token/strk.png";
import { getNonce, listNFTStarknet } from "@/service/nft";
import { useAccount, useContract } from "@starknet-react/core";
import MarketStarknetAbi from "@/contexts/abi/MarketStarknet.abi.json";
import { Divider } from "antd";

interface IModalListNft {
  open: boolean;
  onCancel: any;
  nft: any;
}

const PAYMENT_OPTIONS = [
  {
    label: (
      <div className="flex items-center space-x-2">
        <Image width={16} height={16} src={StrkToken} alt="strk" />
        <span className="text-secondary">STRK</span>
      </div>
    ),
    value: 1,
  },
];

const ModalListNft = ({ open, onCancel, nft }: IModalListNft) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<any>("");
  const [loadingCheckApprove, setLoadingCheckApprove] = useState<any>(false);
  const [loadingList, setLoadingList] = useState<any>(false);
  const router = useRouter();
  const { checkApprovedCollection, handleSignListing } = useStarknet();

  const getCurrency = useMemo(
    () => getCurrencyByChain(5, 1),
    [5, 1]
  );

  const { contract: marketSTRKContractNew } = useContract({
    address: STARKNET_STRK_MARKET_CONTRACT_NEW,
    abi: MarketStarknetAbi,
  }) as any;
  const { account } = useAccount() as any;

  const handleListNftStarknet = async (data: any) => {
    await checkApprovedCollection(data, true);
    setLoadingList(true);
    let contract = {} as any;
     contract = marketSTRKContractNew;
    contract?.connect(account as any);
    const nonce = await getNonce({});
    const [signatureR, signatureS, msgHash] = await handleSignListing(
      data?.nftId?.split("_")[1],
      nonce?.data,
      data?.collectionAddress,
      data?.price
    );
    const dataList = {
      nftId: data?.id,
      price: new BigNumber(data?.price)
        .multipliedBy(STARKNET_OFFSET)
        .toString(),
      listingCounter: nonce?.data,
      messageHash: msgHash,
      signatureR: signatureR,
      signatureS: signatureS,
      tokenUnit: data?.tokenUnit,
    };
    const res = await listNFTStarknet(dataList);
    return res;
  };

  const listNftStarknet = async () => {
    try {
      if (!nft?.collectionId)
        return toast.error("This collection is not verified!");
      setLoading(true);
      console.log(price);
      const res = await handleListNftStarknet({
        ...nft,
        price: price,
        tokenUnit: 1,
      });
      if (res?.data == true) {
        toast.success("List successfully!");
        setLoading(false);
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    } catch (error: any) {
      toast.error(error?.message || error);
      setLoading(false);
    } finally {
      setLoadingList(false);
      onCancel();
    }
  };

  const onListNft = async () => {
    await listNftStarknet();
    
  };

  return (
    <CustomModal
      title="List Items"
      open={open}
      onCancel={onCancel}
      okText="List Now"
      onOk={onListNft}
      loading={loading}
      disabled={!Boolean(Number(price))}
      width={500}
    >
      <div className="mt-5">
\        <div className="text-white flex justify-between items-center space-x-2 py-8 border-b border-solid border-stroke">
          <CustomImage
            src={nft?.imageUrl}
            alt="nft"
            width={50}
            height={50}
            className="rounded-lg"
          />
          <div className="flex-1 flex flex-col justify-between">
            <span className="text-lg font-medium">{nft?.title}</span>
            <div className="flex items-center space-x-2">
              <IconVerified />
              <span className="text-secondary text-sm font-medium">
                {nft?.collectionName}
              </span>
            </div>
          </div>
          {nft?.isListing && (
            <div className="space-x-1 flex items-center">
              <Image
                src={getCurrency.image}
                alt="token"
                width={14}
                height={14}
              />
              <span className="text-sm ">{`${
                formatBalanceByChain(nft?.listingPrice, 5) || 0
              } `}</span>
            </div>
          )}
        </div>
      </div>
      <div className="border-b border-solid border-stroke py-5 space-y-5">
        <div className="flex items-center justify-between text-white font-medium">
          <span className="text-base">Collection floor</span>
          <div className="space-x-1 flex items-center">
            <Image src={getCurrency.image} alt="token" width={14} height={14} />
            <span className="text-sm ">{`${
              formatBalanceByChain(nft?.floorPriceListing, 5) ||
              "--"
            }`}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CustomInput
            placeholder="Price"
            pattern="[0-9\.]*$"
            value={price}
            onChange={(e: any) => {
              if (!e.target.value) setPrice("");
              if (e.target.value && e.target.validity.valid)
                setPrice(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="text-white mt-5">
        <p className="text-lg font-medium">Fee</p>
        <div className="flex items-center justify-between mt-5">
          <span className="text-secondary text-base">
            Platform (2%)
          </span>
          <div className="space-x-1 flex items-center">
            <Image src={getCurrency.image} alt="token" width={14} height={14} />
            <span className="text-sm ">{`${new BigNumber(price || 0)
              .multipliedBy(0.02)
              .toString()} ${getCurrency.currency}`}</span>
          </div>
        </div>
      </div>
      <Divider className="border-stroke" />
        <div>
          <p className="text-base text-white">Check your Wallet</p>
          <p className="text-secondary mt-4">
            You’ll be asked to check and confirm this transaction from your
            wallet.
          </p>
        </div>
    </CustomModal>
  );
};

export default ModalListNft;
