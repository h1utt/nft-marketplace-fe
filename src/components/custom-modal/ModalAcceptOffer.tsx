import React, { useMemo, useState } from "react";
import CustomModal from ".";
import CustomImage from "../custom-image";
import IconVerified from "@/assets/icons/IconVerified";
import { formatBalanceByChain, getCurrencyByChain } from "@/utils";
import Image from "next/image";
import { Divider } from "antd";
import useStarknet from "@/hooks/useStarknet";
import { toast } from "react-hot-toast";
import { CHAIN_VALUES_ENUM } from "@/constants";
import FormatPrice from "../FormatPrice";
import { useApplicationContext } from "@/contexts/useApplication";

interface IModalAcceptOffer {
  open: boolean;
  onCancel: any;
  nft?: any;
  offerData?: any;
}

const ModalAcceptOffer = ({
  open,
  onCancel,
  nft,
  offerData,
}: IModalAcceptOffer) => {
  const [loading, setLoading] = useState(false);

  const { handleAcceptOfferStarknet, handleAcceptCollectionOfferStarknet } =
    useStarknet();

  const onAcceptOfferStarknet = async () => {
    try {
      setLoading(true);
      let res: any;
      if (offerData?.quantity) {
        const [collectionAddress, nftTokenId] = nft?.nftId.split("_");
        res = await handleAcceptCollectionOfferStarknet({
          collectionOfferId: offerData?.offerId,
          quantity: offerData?.quantity,
          offerPrice: offerData?.price,
          collectionAddress: nft?.collectionAddress,
          signatureR: offerData?.signatureR,
          signatureS: offerData?.signatureS || "",
          tokenUnit: 1,
          offerOwnerAddress: offerData?.userAddress,
          tokenId: nftTokenId,
        });
      } else
        res = await handleAcceptOfferStarknet({
          ...offerData,
          nftId: nft?.nftId,
          collectionAddress: nft?.collectionAddress,
        });
      if (res.transaction_hash) {
        setLoading(false);
        toast.success("Accept offer successfully!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  const onConfirmAcceptOffer = async () => {
    await onAcceptOfferStarknet();
  };

  const getCurrency = useMemo(
    () => getCurrencyByChain(5, 1),
    [nft]
  );
  return (
    <CustomModal
      title="Accept Offer"
      open={open}
      onCancel={onCancel}
      okText="Accept Offer"
      width={504}
      loading={loading}
      onOk={onConfirmAcceptOffer}
      zIndex={8889}
    >
      <div>
        <div>
          <div className="flex items-center space-x-2">
            <CustomImage
              src={nft?.imageUrl}
              alt="nft"
              className="w-[50px] h-[50px] rounded-lg"
            />
            <div className="flex-1 flex flex-col justify-between">
              <span className="text-lg font-medium text-white">
                {nft?.title}
              </span>
              <div className="flex items-center space-x-2">
                <IconVerified />
                <span className="text-secondary text-sm font-medium">
                  {nft?.collectionName}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <p className="text-lg text-white font-semibold">
              Other information
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg text-secondary">Price</span>
              <div className="flex items-center space-x-1">
                <Image
                  src={getCurrency.image}
                  alt="token"
                  width={20}
                  height={20}
                />
                <span className="text-white font-medium text-base flex gap-2">
                  {offerData?.price ? (
                    <FormatPrice
                      number={Number(
                        formatBalanceByChain(offerData?.price, 5)
                      )}
                    />
                  ) : (
                    "--"
                  )}{" "}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg text-secondary">You Receive</span>
              <div className="flex items-center space-x-1">
                <Image
                  src={getCurrency.image}
                  alt="token"
                  width={20}
                  height={20}
                />
                <span className="text-white font-medium text-base">
                  {offerData?.price ? (
                    <FormatPrice
                    number={
                      ((formatBalanceByChain(offerData.price, 5) ||
                        0) *
                        98) /
                      100
                    }
                    />
                  ) : (
                    "--"
                  )}{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Divider className="border-stroke" />
        <div className="text-white mt-5">
          <p className="text-lg font-medium">Fee</p>
          <div className="flex items-center justify-between mt-5">
            <span className="text-secondary text-base">
              Platform (2%)
            </span>
            <div className="space-x-1 flex items-center">
              <Image
                src={getCurrency.image}
                alt="token"
                width={14}
                height={14}
              />
              <span className="text-sm ">
                <FormatPrice
                  number={
                    ((formatBalanceByChain(offerData.price, 5) ||
                      0) *
                      2) /
                    100
                  }
                />
              </span>
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
      </div>
    </CustomModal>
  );
};

export default ModalAcceptOffer;
