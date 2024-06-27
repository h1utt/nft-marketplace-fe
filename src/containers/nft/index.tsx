import IconCart from "@/assets/icons/IconCart";
import IconHeart from "@/assets/icons/IconHeart";
import IconRefresh from "@/assets/icons/IconRefresh";
import IconTwitter from "@/assets/icons/IconTwitter";
import CustomImage from "@/components/custom-image";
import { useVenom } from "@/contexts/useVenom";
import {
  formatBalance,
  formatBalanceByChain,
  formatWallet,
  getCurrencyByChain,
} from "@/utils";
import { Button } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import cx from "classnames";
import { NFT_DETAIL_TABS, useNftDetailContext } from "./context";
import OverviewTab from "./OverviewTab";
import PropertiesTab from "./PropertiesTab";
import HistoryTab from "./history";
import OfferTab from "./OfferTab";
import IconVerified from "@/assets/icons/IconVerified";
import ProductCard from "@/components/product-card";
import ModalBuyNft from "@/components/custom-modal/ModalBuyNft";
import useShowModal from "@/hooks/useShowModal";
import ModalListNft from "@/components/custom-modal/ModalListNft";
import Link from "next/link";
import Image from "next/image";
import ModalCancelNFT from "@/components/custom-modal/ModalDeList";
import { NumericFormat } from "react-number-format";
import { Address } from "everscale-inpage-provider";
import ModalBuySuccess from "@/components/custom-modal/ModalBuySuccess";
import ModalWaiting from "@/components/custom-modal/ModalWaiting";
import { CHAIN_VALUES_ENUM, REFUNDABLE_FEE, TOP_RANK } from "@/constants";
import { toast } from "react-hot-toast";
import ModalMakeOffer from "@/components/custom-modal/ModalMakeOffer";
import { useApplicationContext } from "@/contexts/useApplication";
import IconRemoveCart from "@/assets/icons/IconRemoveCart";
import useStarknet from "@/hooks/useStarknet";
import IconPricetag from "@/assets/icons/IconPricetag";
import IconTrash from "@/assets/icons/IconTrash";
import FormatPrice from "@/components/FormatPrice";
import { useStarkProfile } from "@starknet-react/core";

const NftDetailContainer = () => {
  const { provider } = useVenom();
  const {
    currentTab,
    setCurrentTab,
    nftDetail,
    moreNfts,
    handleLikeNft,
    nftOffer,
  } = useNftDetailContext();

  const {
    addItem,
    removeItem,
    items,
    isAuthenticated,
    onShowDrawerConnectWallet,
    currentConnectedAccount,
  } = useApplicationContext();

  const { handleBuyFromListingStarknet } = useStarknet();
  const { data: starkProfile } = useStarkProfile({
    address: nftDetail?.ownerAddress,
  });

  const [isLikeState, setIsLikeState] = useState(nftDetail?.isLike);
  const [numberLikeState, setNumberLikeState] = useState(
    Number(nftDetail?.numberLike || 0)
  );
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
    showModal: showModalBuySuccess,
    onHide: onHideModalBuySuccess,
    onShow: onShowModalBuySuccess,
  } = useShowModal();
  const {
    showModal: showModalWaiting,
    onHide: onHideModalWaiting,
    onShow: onShowModalWaiting,
  } = useShowModal();

  const {
    showModal: showModalMakeOffer,
    onHide: onHideModalMakeOffer,
    onShow: onShowModalMakeOffer,
  } = useShowModal();

  useEffect(() => {
    setIsLikeState(nftDetail?.isLike);
    setNumberLikeState(Number(nftDetail?.numberLike));
  }, [nftDetail?.numberLike, nftDetail?.isLike]);

  const onLikeNftDetail = async () => {
    const res = await handleLikeNft(nftDetail?.nftId);

    if (res) {
      if (isLikeState) setNumberLikeState(numberLikeState - 1);
      else setNumberLikeState(numberLikeState + 1);
      setIsLikeState(res.data);
    }
  };

  const estimatedFund =
    nftDetail?.networkType === CHAIN_VALUES_ENUM.VENOM
      ? Number(nftDetail?.listingPrice) + REFUNDABLE_FEE
      : Number(nftDetail?.listingPrice);

  const getCurrency = useMemo(
    () => getCurrencyByChain(nftDetail?.networkType, nftDetail?.tokenUnit),
    [nftDetail?.networkType, nftDetail?.tokenUnit]
  );

  const onBuyNftVenom = async () => {
    onShowModalWaiting();
    onHideModalBuyNft();
    try {
      const callData = {
        sender: new Address(currentConnectedAccount),
        recipient: new Address(nftDetail?.managerNft),
        amount: estimatedFund.toString(),
        bounce: true,
      };
      const res = await provider?.sendMessage(callData);
      if (res) {
        setTimeout(() => {
          toast.success("Bought successfully!");
          onShowModalBuySuccess();
          onHideModalWaiting();
        }, 2000);
      }
    } catch (error: any) {
      console.log(error);
      onHideModalWaiting();
      toast.error(error.message);
    }
  };

  const onBuyNftStarknet = async () => {
    onShowModalWaiting();
    onHideModalBuyNft();
    try {
      const res = await handleBuyFromListingStarknet(nftDetail);
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

  const onConfirmBuy = async () => {
      return await onBuyNftStarknet();
  };

  const isAddedToCart = !!items?.find((item) => item.id === nftDetail?.nftId);

  const onAddToCart = (e: any) => {
    e.preventDefault();
    const params = {
      id: nftDetail?.nftId,
      collectionAddress: nftDetail?.collectionAddress,
      collectionName: nftDetail?.collectionName,
      imageUrl: nftDetail?.imageUrl,
      listingPrice: nftDetail?.listingPrice,
      title: nftDetail?.title,
      networkType: nftDetail?.networkType,
      signatureR: nftDetail?.signatureR,
      signatureS: nftDetail?.signatureS,
      tokenUnit: nftDetail?.tokenUnit,
    };
    addItem(params);
  };

  const onRemoveFromCart = (e: any) => {
    e.preventDefault();
    removeItem({ id: nftDetail?.nftId });
  };

  return (
    <div>
      <div className="grid grid-col-1 gap-y-5 xl:grid-cols-2 xl:gap-x-5">
        <CustomImage
          src={nftDetail?.imageUrl}
          alt="nft"
          className="w-full rounded-lg"
          wrapperClassName="w-full rounded-lg"
        />
        <div>
          <h1 className="text-[30px] sm:text-5xl font-medium text-white mb-3">
            {nftDetail?.title}
          </h1>
          <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-3 md:space-x-10 flex sm:items-center sm:flex-row flex-col">
            <div>
              <span className="text-secondary">Owner</span>
              <div className="flex items-center space-x-3">
                <CustomImage
                  src="/images/def_avt.png"
                  alt="avatar"
                  className="w-12 h-12 rounded-full"
                />
                <Link href={`/user/${nftDetail?.ownerAddress}?tab=items`}>
                  <span className="text-[18px] text-white hover:underline hover:underline-offset-2">
                    {starkProfile?.name ||
                      formatWallet(nftDetail?.ownerAddress)}
                  </span>
                </Link>
              </div>
            </div>
            <div className="sm:!ml-[2rem]">
              <span className="text-secondary">Collection</span>
              <div className="flex items-center space-x-3">
                <CustomImage
                  src={nftDetail?.collectionImage}
                  alt="avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col items-start">
                  <div className="flex items-center space-x-2">
                    <IconVerified />
                    <Link href={`/collection/${nftDetail?.collectionAddress}`}>
                      <span className="text-[18px] text-white hover:underline hover:underline-offset-2">
                        {formatWallet(nftDetail?.collectionAddress)}
                      </span>
                    </Link>
                  </div>

                  <div className=" text-secondary flex items-center">
                    Floor:&nbsp;
                    <div className="text-white flex items-center">
                      <FormatPrice
                        number={Number(
                          formatBalanceByChain(
                            nftDetail?.floorPriceListing,
                            nftDetail?.networkType
                          )
                        )}
                      />
                      &nbsp;
                      {getCurrency.currency}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-8">
            <Button
              className={cx("btn-ghost text-base", {
                "bg-layer-3": isLikeState,
              })}
              onClick={onLikeNftDetail}
            >
              <IconHeart
                className={cx({
                  "fill-primary stroke-primary": isLikeState && isAuthenticated,
                })}
              />
              <span className={cx("ml-3", { "text-primary": isLikeState })}>
                {numberLikeState}
              </span>
            </Button>
            <Button className="btn-secondary">
              <IconRefresh />
              <span className="ml-3 hidden md:block">Refresh</span>
            </Button>
            <Button className="btn-secondary">
              <IconTwitter width={25} height={25} />
              <span className="ml-3">
                Share <span className="max-sm:hidden">on Twitter</span>
              </span>
            </Button>
          </div>
          <div className="border border-solid border-stroke p-5 rounded-lg space-y-4 mt-6">
            <div className="p-4 bg-layer-2 rounded-lg flex justify-between items-center">
              {nftDetail?.isListing ? (
                <div>
                  <span className="text-secondary">Price</span>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={getCurrency.image}
                      alt="token"
                      width={24}
                      height={24}
                    />
                    <div className="text-white flex items-center text-[18px]">
                      <FormatPrice
                        number={Number(
                          formatBalanceByChain(
                            nftDetail?.listingPrice,
                            nftDetail?.networkType
                          )
                        )}
                      />
                      &nbsp;
                      {getCurrency.currency}
                    </div>
                  </div>
                  {/* <span className="text-sm text-secondary">$26,676</span> */}
                </div>
              ) : (
                <span className="text-white text-lg font-medium h-full justify-self-center">
                  Unlisted
                </span>
              )}
              {isAuthenticated &&
                nftDetail?.ownerAddress != currentConnectedAccount && (
                  <Button
                    onClick={onShowModalMakeOffer}
                    className="btn-secondary self-end"
                  >
                    Make Offer
                  </Button>
                )}
            </div>
            {isAuthenticated &&
              nftDetail?.isListing &&
              nftDetail?.ownerAddress != currentConnectedAccount && (
                <div className="flex space-x-3">
                  <Button
                    className="btn-secondary space-x-3 basis-1/2"
                    onClick={isAddedToCart ? onRemoveFromCart : onAddToCart}
                  >
                    {isAddedToCart ? <IconRemoveCart /> : <IconCart />}
                    <span>
                      {isAddedToCart ? "Remove from Cart" : "Add to Cart"}
                    </span>
                  </Button>
                  <Button
                    className="btn-primary basis-1/2"
                    onClick={onShowModalBuyNft}
                  >
                    Buy now
                  </Button>
                </div>
              )}
            <div className="flex items-center gap-3 w-full">
              {isAuthenticated &&
                !nftDetail?.isListing &&
                nftDetail?.ownerAddress === currentConnectedAccount && (
                  <Button
                    onClick={onShowModalListNft}
                    className="btn-secondary basis-1/2"
                  >
                    <IconPricetag />
                    <span className="ml-2 text-base">List for Sale</span>
                  </Button>
                )}
              {isAuthenticated &&
                nftDetail?.isListing &&
                nftDetail?.ownerAddress === currentConnectedAccount && (
                  <Button
                    onClick={onShowModalCancelNFT}
                    className="btn-secondary basis-1/2"
                  >
                    <IconTrash />
                    <span className="ml-2 text-base">Remove Listing</span>
                  </Button>
                )}
              {!isAuthenticated && (
                <Button
                  className="btn-primary w-full"
                  onClick={onShowDrawerConnectWallet}
                >
                  Connect Wallet
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-secondary text-base">Top Offer</span>
              <div className="flex items-center space-x-2">
                <Image
                  src={getCurrency.image}
                  alt="token"
                  width={16}
                  height={16}
                />
                {nftDetail?.offerPrice ? (
                  <div className="text-base font-medium text-white flex items-center">
                    <FormatPrice
                      number={Number(
                        formatBalanceByChain(
                          nftDetail?.offerPrice,
                          nftDetail?.networkType
                        )
                      )}
                    />
                    &nbsp;
                    {/* <span className="text-secondary">
                      {getCurrency?.currency}
                    </span> */}
                  </div>
                ) : (
                  <span className="text-secondary">--</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-full space-y-5 mt-10">
        <div className="flex items-center mx-4 bg-layer-2 p-2 justify-center rounded-lg w-full">
          <div
            className={cx(
              "rounded-lg h-12 justify-center flex items-center text-secondary hover:text-white flex-1 cursor-pointer",
              {
                "bg-layer-1 text-white":
                  currentTab === NFT_DETAIL_TABS.OVERVIEW,
              }
            )}
            onClick={() => setCurrentTab(NFT_DETAIL_TABS.OVERVIEW)}
          >
            Overview
          </div>
          <div
            className={cx(
              "rounded-lg h-12 justify-center flex items-center text-secondary hover:text-white flex-1 cursor-pointer",
              { "bg-layer-1": currentTab === NFT_DETAIL_TABS.PROPERTIES }
            )}
            onClick={() => setCurrentTab(NFT_DETAIL_TABS.PROPERTIES)}
          >
            Properties
          </div>
          <div
            className={cx(
              "rounded-lg h-12 justify-center flex items-center text-secondary hover:text-white flex-1 cursor-pointer",
              { "bg-layer-1": currentTab === NFT_DETAIL_TABS.HISTORY }
            )}
            onClick={() => setCurrentTab(NFT_DETAIL_TABS.HISTORY)}
          >
            History
          </div>
          <div
            className={cx(
              "rounded-lg h-12 justify-center flex items-center text-secondary hover:text-white flex-1 cursor-pointer",
              { "bg-layer-1": currentTab === NFT_DETAIL_TABS.OFFER }
            )}
            onClick={() => setCurrentTab(NFT_DETAIL_TABS.OFFER)}
          >
            Offer
          </div>
        </div>
        <div className="w-full">
          {currentTab === NFT_DETAIL_TABS.OVERVIEW && <OverviewTab />}
          {currentTab === NFT_DETAIL_TABS.PROPERTIES && <PropertiesTab />}
          {currentTab === NFT_DETAIL_TABS.HISTORY && <HistoryTab />}
          {currentTab === NFT_DETAIL_TABS.OFFER && <OfferTab />}
        </div>
      </div>
      <div className="mt-14">
        <h1 className="text-3xl font-medium text-center text-white">
          More from this collection
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 gap-x-4 gap-y-4">
          {moreNfts?.map((nft, index) => (
            <ProductCard {...nft} key={index} />
          ))}
        </div>
        <div className="w-full flex justify-end mt-10">
          <Link href={`/collection/${nftDetail?.collectionAddress}`}>
            <Button className="btn-secondary">View Collection</Button>
          </Link>
        </div>
      </div>
      <ModalBuyNft
        open={showModalBuyNft}
        onCancel={onHideModalBuyNft}
        nft={nftDetail}
        handleBuy={onConfirmBuy}
      />
      <ModalListNft
        open={showModalListNft}
        onCancel={onHideModalListNft}
        nft={nftDetail}
      />
      <ModalCancelNFT
        open={showModalCancelNFT}
        onCancel={onHideModalCancelNFT}
        nft={nftDetail}
        manager={nftDetail?.managerNft}
      />
      <ModalBuySuccess
        open={showModalBuySuccess}
        nft={nftDetail}
        onCancel={onHideModalBuySuccess}
      />
      <ModalMakeOffer
        open={showModalMakeOffer}
        nft={nftDetail}
        onCancel={onHideModalMakeOffer}
      />
      <ModalWaiting open={showModalWaiting} onCancel={onHideModalWaiting} />
    </div>
  );
};

export default NftDetailContainer;
