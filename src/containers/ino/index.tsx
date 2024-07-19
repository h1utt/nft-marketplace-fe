import IconTwitter from "@/assets/icons/IconTwitter";
import IconVerified from "@/assets/icons/IconVerified";
import CustomImage from "@/components/custom-image";
import React from "react";
import Public from "./public";
import Link from "next/link";
import IconDiscord from "@/assets/icons/IconDiscord";
import { Provider, useContexts } from "./context";
import ModalMintSuccess from "@/components/custom-modal/ModalMintSuccess";

const INODetailContainerImpl = () => {
  const {
    dataCMS,
    nftMinted,
    showModalMintSuccess,
    onHideModalMintSuccess,
  }: any = useContexts();

  const getUnixTime = (idx: any) => {
    return new Date(idx).getTime();
  };

  const attributes = dataCMS?.attributes;

  const arr = [
    { time: getUnixTime(attributes?.publicStartTime), component: <Public /> },
  ];

  const arrSort = arr
    .filter((x) => x.time != 0)
    .sort((a, b) => a.time - b.time);

  return (
    <div className="pb-20">
      <div className="flex flex-col space-y-5">
        <div className="relative">
          <CustomImage
            src={"/images/banner/banner_final.png"}
            alt="cover"
            className="w-full min-h-[300px] object-cover md:aspect-[4/1] rounded-lg"
            wrapperClassName="w-full"
          />
          <div className="absolute bottom-5 px-5 flex justify-between w-full">
            <div className="stat-ino p-3">
              <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
              {(
                dataCMS?.attributes?.collectionStatus || "COMING"
              ).toUpperCase()}
            </div>
            <div className="flex flex-row gap-2">
              <Link
                href={"/"}
                target="_blank"
                rel="noreferrer"
                className="stat-ino p-3"
              >
                <IconTwitter height={20} width={20} fill="white" />
              </Link>
              <Link
                href={"/"}
                target="_blank"
                rel="noreferrer"
                className="stat-ino p-3"
              >
                <IconDiscord height={20} width={20} fill="white" />
              </Link>
            </div>
          </div>
        </div>
        <Link
          href={`/collection/${dataCMS?.attributes?.SC_collection || ""}`}
          className="text-primary  self-end !mt-3 hidden sm:block"
        >
          View Collection
        </Link>
      </div>
      <div className="flex mt-4 flex-col lg:flex-row">
        <div className="w-full basis-1/2">
          <div className="flex items-center space-x-6 flex-col rounded-lg border border-solid border-stroke lg:p-5 w-full p-2">
            <CustomImage
              src={dataCMS?.attributes?.logo?.data?.attributes?.url}
              alt="avatar"
              className="max-w-[250px] object-cover rounded-lg aspect-square border-2 border-white border-solid"
            />
            <div className="mt-3 !ml-0 md:!ml-4">
              <div className="text-white font-semibold text-xl flex items-center justify-center space-x-2 my-2">
                <span>{dataCMS?.attributes?.name}</span>
                <IconVerified />
              </div>
              <p className="text-secondary font-medium three_dot_2_line flex justify-center text-sm my-2">
                {dataCMS?.attributes?.description}
              </p>
              <div className="flex items-center justify-center flex-row gap-2 mt-4">
              </div>
              <Link
                href={`/collection/${dataCMS?.attributes?.SC_collection || ""}`}
                className="text-primary self-end !mt-3 block sm:hidden"
              >
                View Collection
              </Link>
            </div>
          </div>
          <div className="max-lg:hidden flex">
          </div>
        </div>
        <div className="basis-1/2 w-full lg:ml-4 ml-0 mt-4 lg:mt-0">
          {arrSort.map((item, index) => (
            <div key={index}>{item.component}</div>
          ))}
          <div className="lg:hidden flex">
          </div>
        </div>
      </div>
      <ModalMintSuccess
        open={showModalMintSuccess}
        onCancel={onHideModalMintSuccess}
        nft={nftMinted}
      />
    </div>
  );
};
const INODetailContainer = (props: any) => (
  <Provider {...props}>
    <INODetailContainerImpl />
  </Provider>
);
export default INODetailContainer;
