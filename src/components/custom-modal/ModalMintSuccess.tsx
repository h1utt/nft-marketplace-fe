import CustomModal from ".";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Success from "../../../public/images/Success.png";
import { useAccount } from "@starknet-react/core";

interface IModalMintSuccess {
  open: boolean;
  onCancel: any;
  nft: any;
}
const ModalMintSuccess = ({ open, onCancel, nft }: IModalMintSuccess) => {
  const [loading, setLoading] = useState(false);
  const { account } = useAccount();
  const router = useRouter();
  const handleGotoProfile = () => {
    router.push(`/user/${account?.address}?tab=items`);
    onCancel();
  };
  return (
    <CustomModal
      title="Mint Success"
      open={open}
      onCancel={onCancel}
      destroyOnClose={true}
      loading={loading}
      width={350}
      okText="My Profile"
      onOk={handleGotoProfile}
    >
      <div className="pt-5">
        <div className="text-white flex flex-col space-x-2 pb-4">
          <Image src={Success} alt="token" />
        </div>
        <div className="text-secondary text-base flex flex-row gap-1">
          Go to{" "}
          <Link href={`/user/${account}?tab=items`} className="text-primary">
            My Profile
          </Link>{" "}
          to check your item
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalMintSuccess;
