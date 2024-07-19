import ModalBuyNft from "@/components/custom-modal/ModalBuyNft";
import ModalListNft from "@/components/custom-modal/ModalListNft";
import {
  GRID_MODE,
} from "@/constants";
import { useApplicationContext } from "@/contexts/useApplication";
import { useVenom } from "@/contexts/useVenom";
import useShowModal from "@/hooks/useShowModal";
import useStarknet from "@/hooks/useStarknet";
import { formatBalanceByChain, getCurrencyByChain } from "@/utils";
import { Button, Tooltip } from "antd";
import Image from "next/image";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import FormatPrice from "../FormatPrice";
import CustomImage from "../custom-image";
import ModalBuySuccess from "../custom-modal/ModalBuySuccess";
import ModalCancelNFT from "../custom-modal/ModalDeList";
import ModalMakeOffer from "../custom-modal/ModalMakeOffer";
import ModalWaiting from "../custom-modal/ModalWaiting";
import Link from "next/link";

const ProductCardPro = (props: any) => {
  const {
    nftId,
    title,
    imageUrl,
    listingPrice,
    ownerAddress,
    isListing,
    offerPrice,
    gridMode,
  } = props;
  const { provider } = useVenom();
  const {
    isAuthenticated,
    currentConnectedAccount,
    onShowDrawerConnectWallet,
  } = useApplicationContext();
  const { handleBuyFromListingStarknet } = useStarknet();

  const getCurrency = useMemo(
    () => getCurrencyByChain(5, 1),
    [5, 1]
  );

  const renderPrice = () => {
    if (!isListing)
      return (
        <div className="flex items-center space-x-1">
          <Image src={getCurrency.image} alt="Venom" width={12} height={12} />
          <span className="text-white text-xs font-medium">Unlisted</span>
        </div>
      );
    return (
      <div className="flex justify-between leading-[18px]">
        <span className="text-secondary text-xs font-medium">Price</span>
        <div className="flex items-center space-x-1">
          <Image src={getCurrency.image} alt="Venom" width={12} height={12} />
          <span className="text-white text-xs font-medium">
            <FormatPrice
              number={Number(formatBalanceByChain(listingPrice, 5))}
            />{" "}
          </span>
        </div>
      </div>
    );
  };
  const {
    showModal: showModalBuyNft,
    onHide: onHideModalBuyNft,
    onShow: onShowModalBuyNft,
  } = useShowModal();
  const {
    showModal: showModalListNft,
    onHide: onHideModalListNft,
    onShow: onShowModalListNft,
  } = useShowModal();
  const {
    showModal: showModalCancelNFT,
    onHide: onHideModalCancelNFT,
    onShow: onShowModalCancelNFT,
  } = useShowModal();

  const {
    showModal: showModalMakeOffer,
    onHide: onHideModalMakeOffer,
    onShow: onShowModalMakeOffer,
  } = useShowModal();
  const {
    showModal: showModalBuySuccess,
    onHide: onHideModalBuySuccess,
    onShow: onShowModalBuySuccess,
  } = useShowModal();
  const {
    showModal: showModalWaiting,
    onHide: onHideModalWaiting,
    onShow: onShowModalWaiting,
  } = useShowModal();

  const onBuyNftStarknet = async () => {
    onShowModalWaiting();
    onHideModalBuyNft();
    try {
      const res = await handleBuyFromListingStarknet(props);
      if (res?.transaction_hash) {
        toast.success("Bought successfully!");
        onShowModalBuySuccess();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      onHideModalWaiting();
    }
  };

  const onClickBuy = (e: any) => {
    e.stopPropagation();
    if (!isAuthenticated) return onShowDrawerConnectWallet();
  };

  const onConfirmBuy = async () => {
    await onBuyNftStarknet();
  };

  return (
    <div>
      <Link href={`/nft/${nftId}`}>
        <div
          className="bg-layer-2 cursor-pointer border border-solid rounded-lg p-2 border-stroke group"
        >
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <div className="aspect-square w-full overflow-hidden relative rounded-lg">
                <CustomImage
                  src={imageUrl}
                  alt="Nft"
                  className="object-cover w-full h-full group-hover:scale-110 !transition !duration-300 !ease-in-out group-hover:blur-sm"
                  wrapperClassName="w-full h-full"
                />
              </div>

              {isListing ? (
                <>
                  {currentConnectedAccount !== ownerAddress ? (
                    <div className="items-center space-x-2 w-[90%] hidden group-hover:flex absolute bottom-3 right-1/2 translate-x-1/2 z-5">
                      <Button
                        onClick={onClickBuy}
                        className="btn-primary flex-1"
                      >
                        Buy
                      </Button>
                    </div>
                  ) : (
                    <div className="items-center space-x-2 w-[90%] hidden group-hover:flex absolute bottom-3 right-1/2 translate-x-1/2 z-5">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="btn-primary flex-1"
                      >
                        Remove Listing
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {currentConnectedAccount !== ownerAddress ? (
                    <div className="items-center w-[90%] hidden group-hover:flex absolute bottom-3 right-1/2 translate-x-1/2 z-5">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="btn-primary flex-1"
                      >
                        Make Offer
                      </Button>
                    </div>
                  ) : (
                    <div className="items-center w-[90%] hidden group-hover:flex absolute bottom-3 right-1/2 translate-x-1/2 z-5">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="btn-primary flex-1"
                      >
                        List for Sale
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <Tooltip title={title}>
                <span className="text-white text-base font-medium leading-6 truncate">
                  {title}
                </span>
              </Tooltip>
            </div>
            <>
              {gridMode === GRID_MODE.SMALL && renderPrice()}
              {(gridMode === GRID_MODE.LARGE || !gridMode) && (
                <div className="bg-layer-3 rounded-lg p-2 flex flex-col space-y-2">
                  {renderPrice()}
                  <div className="flex justify-between leading-[18px]">
                    <span className="text-secondary text-xs font-medium">
                      Top offer
                    </span>
                    {offerPrice ? (
                      <div className="flex items-center space-x-1">
                        <Image
                          src={getCurrency.image}
                          alt="Venom"
                          width={12}
                          height={12}
                        />
                        <span className="text-white text-xs font-medium">
                          <FormatPrice
                            number={Number(
                              formatBalanceByChain(offerPrice, 5)
                            )}
                          />{" "}
                          {/* {getCurrency.currency} */}
                        </span>
                      </div>
                    ) : (
                      <span className="text-secondary">--</span>
                    )}
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      </Link>
      <ModalBuyNft
        open={showModalBuyNft}
        onCancel={onHideModalBuyNft}
        nft={props}
        handleBuy={onConfirmBuy}
      />
      <ModalBuySuccess
        open={showModalBuySuccess}
        nft={props}
        onCancel={onHideModalBuySuccess}
      />
      <ModalListNft
        open={showModalListNft}
        onCancel={onHideModalListNft}
        nft={props}
      />
      <ModalCancelNFT
        open={showModalCancelNFT}
        onCancel={onHideModalCancelNFT}
        nft={props}
        manager={props?.managerNft || ""}
      />
      <ModalMakeOffer
        open={showModalMakeOffer}
        onCancel={onHideModalMakeOffer}
        nft={props}
      />
      <ModalWaiting open={showModalWaiting} onCancel={onHideModalWaiting} />
    </div>
  );
};

export default ProductCardPro;
