import IconVerified from "@/assets/icons/IconVerified";
import useStarknet from "@/hooks/useStarknet";
import { formatBalanceByChain, getCurrencyByChain } from "@/utils";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import CustomModal from ".";
import CustomImage from "../custom-image";
import { useProvider } from "@starknet-react/core";

interface IModalCancelNFT {
  open: boolean;
  onCancel: any;
  nft: any;
  manager: any;
}
const ModalCancelNFT = ({ open, onCancel, nft, manager }: IModalCancelNFT) => {
  const [loading, setLoading] = useState(false);
  const { provider } = useProvider();
  const { handleCancelListingStarknet } = useStarknet();
  const getCurrency = useMemo(() => getCurrencyByChain(5, 1), [5, 1]);

  const onCancelListingStarknet = async () => {
    try {
      setLoading(true);
      let res = await handleCancelListingStarknet({ ...nft });
      if (res.transaction_hash) {
        await provider.waitForTransaction(res?.transaction_hash);
        setLoading(false);
        toast.success("Cancel listing successfully!");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  const onCancelListing = async () => {
    await onCancelListingStarknet();
  };

  return (
    <CustomModal
      title="Delist Items"
      open={open}
      onCancel={onCancel}
      destroyOnClose={true}
      loading={loading}
      width={500}
      okText="Delist"
      onOk={onCancelListing}
    >
      <div className="pt-5">
        <div className="text-white flex justify-between items-center space-x-2 pb-8 border-b border-solid border-stroke">
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
          {
            <div className="space-x-1 flex items-center">
              <Image
                src={getCurrency.image}
                alt="token"
                width={14}
                height={14}
              />
              <span className="text-sm">
                <NumericFormat
                  value={formatBalanceByChain(nft?.listingPrice || 0, 5)}
                  displayType="text"
                  thousandSeparator=","
                />{" "}
              </span>
            </div>
          }
        </div>
        <h4 className="text-base font-semibold text-[white] leading-6 mb-3 mt-3">
          Delist Items?
        </h4>
        <p className="text-[#BABAC7] leading-5">
          By canceling your listing, you will remove the sale from Market and
          requires a transaction to ensure that it cannot be fulfilled in the
          future.
        </p>
      </div>
    </CustomModal>
  );
};

export default ModalCancelNFT;
