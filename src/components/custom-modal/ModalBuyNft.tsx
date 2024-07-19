import IconCopy from "@/assets/icons/IconCopy";
import IconInfo from "@/assets/icons/IconInfo";
import IconVerified from "@/assets/icons/IconVerified";
import { REFUNDABLE_FEE } from "@/constants";
import { useVenom } from "@/contexts/useVenom";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { formatBalance, formatAddress } from "@/utils";
import { Tooltip } from "antd";
import Image from "next/image";
import CustomModal from ".";
import StrkToken from "../../../public/images/token/strk.png";
import CustomImage from "../custom-image";
import { Divider } from "antd";

interface IModalBuyNft {
  open: boolean;
  onCancel: any;
  nft?: any;
  handleBuy?: any;
}

const ModalBuyNft = ({ open, onCancel, nft, handleBuy }: IModalBuyNft) => {
  const [text, copy] = useCopyToClipboard();
  const { account, balance } = useVenom();
  const estimatedFund = Number(nft?.listingPrice) + REFUNDABLE_FEE;

  return (
    <CustomModal
      title="Checkout"
      open={open}
      onCancel={onCancel}
      okText="Buy Now"
      onOk={handleBuy}
    >
      <div>
        <p className="text-secondary text-base">You decide to buy</p>
        <div className="text-white flex justify-between items-center space-x-2 py-8 border-b border-solid border-stroke">
          <CustomImage
            src={nft?.imageUrl}
            alt="nft"
            width={50}
            height={50}
            className="rounded-lg"
          />
          <div className="flex-1 flex flex-col justify-between truncate">
            <span className="text-lg font-medium truncate">{nft?.title}</span>
            <div className="flex items-center space-x-2">
              <IconVerified />
              <span className="text-secondary text-sm font-medium truncate">
                {nft?.collectionName}
              </span>
            </div>
          </div>
          <div className="space-x-1 flex items-center">
            <Image src={StrkToken} alt="token" width={14} height={14} />
            <span className="text-sm ">
              {formatBalance(nft?.listingPrice)} STRK
            </span>
          </div>
        </div>
        {Number(balance * 10 ** 9) <= Number(estimatedFund) ? (
          <p className="mt-4 text-secondary">Not enough fund in STRK</p>
        ) : (
          <div className="flex items-center justify-between text-white mt-4">
            <span>You will pay</span>
            <div className="space-x-1 flex items-center font-medium text-base">
              <Image src={StrkToken} alt="token" width={14} height={14} />
              <span className="text-sm ">
                {formatBalance(estimatedFund)} STRK
              </span>
            </div>
          </div>
        )}
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

export default ModalBuyNft;
