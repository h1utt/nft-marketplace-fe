import React, { useMemo, useState } from "react";
import CustomModal from ".";
import CustomImage from "../custom-image";
import IconVerified from "@/assets/icons/IconVerified";
import Image from "next/image";
import CustomInput from "../input";
import CustomSelect from "../select";
import { DURATION_OPTIONS } from "@/constants";
import {
  formatBalanceByChain,
  getCurrencyByChain,
} from "@/utils";
import { toast } from "react-hot-toast";
import useStarknet from "@/hooks/useStarknet";
import { useApplicationContext } from "@/contexts/useApplication";
import { Divider } from "antd";

interface IModalMakeCollectionOffer {
  open: boolean;
  onCancel: any;
  collection?: any;
}

const ModalMakeCollectionOffer = ({
  open,
  onCancel,
  collection,
}: IModalMakeCollectionOffer) => {
  const [price, setPrice] = useState<any>("");
  const [quantity, setQuantity] = useState<any>("");
  const [date, setDate] = useState<any>(DURATION_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);
  const { handleMakeCollectionOfferStarknet } = useStarknet();

  const getCurrency = useMemo(
    () => getCurrencyByChain(5, 1),
    [collection]
  );

  const onMakeCollectionOfferVenom = () => {
    toast.success("Coming soon!");
  };

  const onMakeCollectionOfferMint = () => {
    toast.success("Coming soon!");
  };

  const onMakeCollectionOfferStarknet = async () => {
    try {
      setLoading(true);
      const res = await handleMakeCollectionOfferStarknet({
        collectionAddress: collection?.address,
        quantity: Number(quantity),
        price,
        expireTime: Math.floor(
          (Date.now() + 60 * 60 * 24 * date * 1000) / 1000
        ),
        ...collection,
      });
      if (res?.data == true) {
        setLoading(false);
        toast.success("Make collection offer successfully!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  const { isAuthenticated, onShowDrawerConnectWallet } =
    useApplicationContext();

  const onConfirmMakeCollectionOffer = async () => {
    if (!isAuthenticated) {
      toast.error("Please connect wallet to make offer.");
      onCancel();
      onShowDrawerConnectWallet();
      return;
    }
    if (!Number(price)) return toast.error("Price must be larger than 0.");
    if (!Number(quantity))
      return toast.error("Quantity must be larger than 0.");

    return await onMakeCollectionOfferStarknet();
  };
  const onChangeSort = (value: any) => {
    setDate(value);
  };

  return (
    <CustomModal
      title="Make Collection Offer"
      open={open}
      onCancel={onCancel}
      okText="Make Offer"
      width={504}
      onOk={onConfirmMakeCollectionOffer}
      loading={loading}
    >
      <div>
        <div className="rounded-lg border border-solid border-stroke bg-layer-2 p-2">
          <div className="flex items-center space-x-2">
            <CustomImage
              src={collection?.logo}
              alt="nft"
              className="w-[50px] h-[50px] rounded-lg"
            />
            <div className="flex-1 flex flex-col justify-between">
              <span className="text-lg font-medium text-white">
                {collection?.name}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-secondary">Floor:</span>
                <div className="text-white text-sm font-medium flex items-center">
                  <Image
                    src={getCurrency.image}
                    alt="token"
                    width={14}
                    height={14}
                  />
                  &nbsp;
                  {formatBalanceByChain(
                    collection?.floorPriceListing,
                    5
                  )}
                  &nbsp;
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 mt-5">
          <p className="text-white text-lg font-medium">Offer information</p>
          <div className="space-y-1">
            <label className="text-secondary text-xs mb-1">Price</label>
            <CustomInput
              placeholder="Price"
              className="h-[62px]"
              pattern="[0-9\.]*$"
              value={price}
              onChange={(e: any) => {
                if (!e.target.value) setPrice("");
                if (e.target.value && e.target.validity.valid)
                  setPrice(e.target.value);
              }}
              suffix={
                <Image
                  src={getCurrency.image}
                  alt="token"
                  width={20}
                  height={20}
                />
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-secondary text-xs mb-1">Quantity</label>
            <CustomInput
              placeholder="Quantity"
              className="h-[62px]"
              pattern="[0-9\.]*$"
              value={quantity}
              onChange={(e: any) => {
                if (!e.target.value) setQuantity("");
                if (e.target.value && e.target.validity.valid)
                  setQuantity(e.target.value);
              }}
            />
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
      </div>
    </CustomModal>
  );
};

export default ModalMakeCollectionOffer;
