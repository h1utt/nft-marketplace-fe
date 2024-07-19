import Items_Countdown_timer from "../../components/items_countdown_timer";
import { Button } from "antd";
import { useContexts } from "./context";
import { getCurrencyByChain, isDateGreater } from "@/utils";
import EvenEnd from "./eventEnd";
import Image from "next/image";
import useFunctionIDO from "./functionINO";
import { useApplicationContext } from "@/contexts/useApplication";
import { useMemo, useState } from "react";
import FormatPrice from "@/components/FormatPrice";

const Mintlist = () => {
  const {
    currentConnectedAccount: account,
    currentConnectedChain,
    onShowDrawerConnectWallet,
  } = useApplicationContext();

  const {
    loadingPL,
    dataCMS,
    accNftData,
    mintedByPool,
    nftDataPoolSV,
  }: any = useContexts();

  const { handleMintStarknet } = useFunctionIDO();

  const attributes = dataCMS?.attributes;
  const pricePublic = attributes?.pricePublic;

  const currentAccountMint = accNftData[attributes?.code]?.public || 0;

  const publicStartTime = attributes?.publicStartTime;
  const publicEndTime = attributes?.publicEndTime;
  const poolName = attributes?.mintPoolPublicName || "Public";

  const [quantityMint, setQuantityMint] = useState<any>(1);

  const mintNFT = async (type: any) => {
    attributes?.chainNetwork?.includes("starknet") &&
      (await handleMintStarknet(type, quantityMint));
  };

  const rightChain = attributes?.chainNetwork
    ?.toLowerCase()
    ?.includes(currentConnectedChain?.toLowerCase());

  const currency = useMemo(
    () => getCurrencyByChain(attributes?.chainNetwork?.toLowerCase()),
    [attributes?.chainNetwork]
  );

  const getMaxPublicMint = () => {
    if (
      attributes?.crossPoolMint &&
      isDateGreater(new Date(publicStartTime), new Date())
    ) {
      return attributes?.maxPublicMint ? attributes?.maxPublicMint : 0;
    }
    if (
      attributes?.crossPoolMint &&
      !isDateGreater(new Date(publicStartTime), new Date())
    ) {
      return (
        Number(attributes?.itemCount) -
        Number(mintedByPool?.whitelist) -
        Number(mintedByPool?.private) -
        Number(mintedByPool?.holder) -
        (attributes?.reserved || 0)
      );
    } else {
      return attributes?.maxPublicMint;
    }
  };
  const maxPublicMint = parseInt(
    getMaxPublicMint() < 0 ? 0 : getMaxPublicMint()
  );

  const currentPublicMint =
    Number(mintedByPool?.public || nftDataPoolSV?.public || 0) < maxPublicMint
      ? Number(mintedByPool?.public || nftDataPoolSV?.public || 0)
      : maxPublicMint;

  return (
    <>
      {JSON.stringify(dataCMS) !== "{}" &&
        attributes?.publicAccountLimit &&
        attributes?.publicAccountLimit > 0 && (
          <div className="rounded-lg border border-solid border-stroke lg:p-5 w-full p-2 my-1">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-white text-lg">{poolName}</div>
                {currentAccountMint > 0}
              </div>
              {Number(currentPublicMint) >= Number(maxPublicMint) && (
                <span className="text-primary text-lg">SOLD OUT</span>
              )}
            </div>
            <div className="flex flex-row gap-3 rounded-2xl pt-3">
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Price</span>
                <span className="text-[18px] text-white mt-1 font-display font-semibold flex items-center">
                  <Image
                    src={currency.image}
                    alt="Strk"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {Number(pricePublic) == -1 ? (
                    `TBA`
                  ) : (
                    <FormatPrice number={pricePublic} />
                  )}{" "}
                  <div className="text-secondary ml-1 hidden sm:block">
                    {currency.currency}
                  </div>
                </span>
              </div>
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Items</span>
                <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                  {"∞"}
                </span>
              </div>
              <div className="flex flex-col bg-layer-2 basis-[33.33%] p-2 py-[1rem] rounded-lg items-center">
                <span className="text-secondary text-[14px]">Max</span>
                <span className=" text-[18px] text-white mt-1 font-display font-semibold">
                  {"∞"}
                </span>
              </div>
            </div>
            <div className="flex items-center sm:justify-evenly justify-between pt-3 text-white">
              {isDateGreater(new Date(publicStartTime), new Date()) && (
                <>
                  <span className="text-[16px]">Starts In:</span>
                  <div className="w-[50%] text-[20px]">
                    <Items_Countdown_timer
                      className="!w-[200px]"
                      time={
                        Number(new Date(publicStartTime)) - Number(new Date())
                      }
                    />
                  </div>
                </>
              )}
              {isDateGreater(new Date(), new Date(publicEndTime)) && (
                <EvenEnd />
              )}
              {isDateGreater(new Date(publicEndTime), new Date()) &&
                isDateGreater(new Date(), new Date(publicStartTime)) && (
                  <>
                    {attributes?.code != "devnetchicken" ? (
                      <>
                        <span className="text-[16px]">End In:</span>
                        <div className="w-[50%] text-[20px]">
                          <Items_Countdown_timer
                            className="!w-[200px]"
                            time={
                              Number(new Date(publicEndTime)) -
                              Number(new Date())
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
            </div>
            {isDateGreater(new Date(publicEndTime), new Date()) &&
              isDateGreater(new Date(), new Date(publicStartTime)) && (
                <div>
                  <div className="flex items-center justify-evenly pt-3 text-white">
                    {!!account &&
                      rightChain &&
                      currentPublicMint < maxPublicMint && (
                        <div className="flex items-center gap-10 max-sm:gap-2 w-full">
                          <Button
                            loading={loadingPL}
                            onClick={() => !loadingPL && mintNFT("public")}
                            className="btn-primary w-full"
                          >
                            {`Mint NFT`}
                          </Button>
                        </div>
                      )}
                    {(!account || !rightChain) && (
                      <Button
                        onClick={onShowDrawerConnectWallet}
                        className="btn-primary w-full"
                      >{`Connect Wallet`}</Button>
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
    </>
  );
};
export default Mintlist;
