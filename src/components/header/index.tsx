import { formatAddress } from "@/utils";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import DefaultAvatar from "../../../public/images/default_avatar.png";
import Logo from "../../../public/images/logo/logo_final.png";
import StrkToken from "../../../public/images/token/strk.png";
import cx from "classnames";
import { useRouter } from "next/router";
import IconHamburger from "@/assets/icons/IconHamburger";
import IconSearch from "@/assets/icons/IconSearch";
import { Drawer } from "antd";
import { useState } from "react";
import IconNoti from "@/assets/icons/IconNoti";
import IconWallet from "@/assets/icons/IconWallet";
import IconSetting from "@/assets/icons/IconSetting";
import DrawerWallet from "../custom-drawer/DrawerWallet";
import useShowModal from "@/hooks/useShowModal";
import Search from "./Search";
import { ConnectButton } from "@mysten/wallet-kit";
import { useApplicationContext } from "@/contexts/useApplication";
import DrawerConnectWallet from "../custom-drawer/DrawerConnectWallet";

const Header = () => {
  const {
    isAuthenticated,
    currentConnectedAccount,
    showDrawerConnectWallet,
    onShowDrawerConnectWallet,
    onHideDrawerConnectWallet,
  } = useApplicationContext();
  const {
    showModal: showDrawerWallet,
    onShow: onShowDrawerWallet,
    onHide: onHideDrawerWallet,
  } = useShowModal();
  const router = useRouter();
  const menus = [
    {
      href: "/",
      name: "Marketplace",
    },
    {
      href: "/explore",
      name: "Explore",
    },
    {
      href: "/ranking",
      name: "Ranking",
    },
  ];

  /* Drawer */
  const [open, setOpen] = useState(false);
  /* End Drawer */

  return (
    <div className="md:layout sticky top-0 z-50 bg-layer-1">
      <Drawer
        title={
          !isAuthenticated ? (
            <ConnectButton className="btn-primary w-full !text-black" />
          ) : (
            <div className="bg-layer-1 rounded-lg flex items-center p-2 space-x-2">
              <Image src={DefaultAvatar} alt="Avatar" width={24} height={24} />
              <span className="text-white font-medium">
                {formatAddress(currentConnectedAccount?.address)}
              </span>
            </div>
          )
        }
        placement={"left"}
        closable={false}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        key={0}
        className="drawer_custom text-[#94A7C6] text-[16px] font-[600]"
      >
        <ul className="flex flex-col gap-[1.5rem]">
          <li className="flex gap-[0.5rem]">
            <IconNoti />
            <p>Notification</p>
          </li>
          <li className="flex gap-[0.5rem]">
            <IconWallet />
            <p>Wallet</p>
          </li>
          <li
            className=""
            onClick={() => {
              setOpen(false);
            }}
          >
            <Link
              className="flex gap-[0.5rem]"
              href={`/settings/${currentConnectedAccount}`}
            >
              <IconSetting />
              <p>Settings</p>
            </Link>
          </li>
        </ul>
      </Drawer>
      <div className="w-full py-5 max-lg:p-[16px] max-md:bg-[#131924]">
        {/* PC Design */}
        <div className="grid grid-cols-3 max-lg:hidden">
          <Link href="/" className="cursor-pointer">
            <Image src={Logo} alt="Logo" />
          </Link>
          <Search />
          <div className="bg-layer-3 rounded-lg px-2 flex items-center space-x-3 justify-self-end h-[70px]">
            <div className="flex px-[0.5rem] items-center space-x-2 border-r border-solid border-focus">
              <Image src={StrkToken} alt="Venom" />
              <div className="flex flex-col items-center">
                <span className="text-white font-medium leading-6">STRK</span>
              </div>
            </div>
            {!isAuthenticated && (
              <Button
                className="btn-primary h-10"
                onClick={onShowDrawerConnectWallet}
              >
                Connect Wallet
              </Button>
            )}
            {isAuthenticated && (
              <div
                className="bg-layer-1 rounded-lg flex items-center p-2 space-x-2 cursor-pointer"
                onClick={onShowDrawerWallet}
              >
                <img
                  src={"/images/default_avatar.png"}
                  alt="Avatar"
                  className="rounded-lg w-6"
                />
                <div className="flex flex-col items-start justify-between">
                  <span className="text-white font-medium text-xs">
                    {formatAddress(currentConnectedAccount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* End Pc Design */}

        {/* Mobile Design */}
        <div className="lg:hidden flex justify-between">
          <div className="flex gap-[0.5rem]">
            <IconHamburger
              onClick={() => {
                setOpen(!open);
              }}
            />
            <Link href="/" className="cursor-pointer">
            </Link>
          </div>

          <div className="flex items-center gap-[1rem]">
            <IconSearch />
          </div>
        </div>
        {/* End Mobile Design */}
      </div>
      <div className="flex items-center justify-center space-x-3 py-4">
        {menus.map((menu, index) => (
          <Link
            href={menu.href}
            key={index}
            className={cx(
              "text-secondary font-normal p-[6px] text-base hover:text-primary",
              {
                "rounded-lg !text-primary": menu.href === router.pathname,
              }
            )}
          >
            {menu.name}
          </Link>
        ))}
      </div>
      <DrawerWallet open={showDrawerWallet} onClose={onHideDrawerWallet} />
      <DrawerConnectWallet
        open={showDrawerConnectWallet}
        onClose={onHideDrawerConnectWallet}
      />
    </div>
  );
};

export default Header;
