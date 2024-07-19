import CustomImage from "@/components/custom-image";
import { formatAddress } from "@/utils";
import { Tabs, Typography } from "antd";
import Items from "./Items";
import IconCopy from "@/assets/icons/IconCopy";
import { useUserContext } from "./context";
import Activity from "./activity";
import { useApplicationContext } from "@/contexts/useApplication";
import Offer from "./offer";

const UserContainer = () => {
  const { currentConnectedAccount, profile } = useApplicationContext();
  const { Paragraph } = Typography;
  const { listNft, onSelectTab, tab } = useUserContext();
  const collectionInfos = [
    {
      name: "Address",
      value: (
        <div className="flex">
          {`${formatAddress(currentConnectedAccount)}`}
          <Paragraph
            copyable={{
              text: currentConnectedAccount,
              icon: [
                <IconCopy key="copy-icon" />,
                <IconCopy key="copied-icon" />,
              ],
            }}
          ></Paragraph>
        </div>
      ),
    },
    {
      name: "Items",
      value: listNft?.data?.length,
    },
    {
      name: "Listings",
      value: listNft?.data?.filter((x: any) => x.isListing == true).length,
    },
    {
      name: "Sold",
      value: "--",
    },
  ];

  const tabs = [
    {
      key: "1",
      label: `Owned`,
      children: <Items />,
    },
    {
      key: "4",
      label: `Activity`,
      children: <Activity />,
    },
    {
      key: "5",
      label: `Offer`,
      children: <Offer />,
      visible: true,
    },
  ];
  const getURL = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  return (
    <div className="w-full pb-20">
      <div className="flex flex-col space-y-5">
        <div>
          <CustomImage
            src="/images/banner/banner_final.png"
            alt="cover"
            className="w-full min-h-[250px] object-cover md:aspect-[4/1] rounded-lg"
            wrapperClassName="w-full"
          />
        </div>
        <div className="flex items-start w-full lg:space-x-4 lg:flex-row flex-col space-x-0 space-y-5 lg:space-y-5 justify-between">
          <div className="flex items-center space-x-6 basis-2/3 mb-6 mt-4">
            <CustomImage
              src="/images/def_avt.png"
              alt="avatar"
              className="w-[156px] object-cover rounded-lg aspect-square min-w-[78px] "
            />
            <div className="flex-1">
              <div className="text-white font-semibold text-xl flex items-center space-x-2">
                <span>{profile?.userName || "Unknown"}</span>
                {/* <IconVerified /> */}
              </div>
              <div className="text-secondary font-medium flex items-center">
                {formatAddress(currentConnectedAccount)}
                <Paragraph
                  copyable={{
                    text: currentConnectedAccount,
                    icon: [
                      <IconCopy key="copy-icon" />,
                      <IconCopy key="copied-icon" />,
                    ],
                  }}
                ></Paragraph>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Tabs
          items={tabs}
          className="custom-tabs"
          onChange={onSelectTab}
          activeKey={tab}
        />
      </div>
    </div>
  );
};

export default UserContainer;
