import {
  POOL_TYPE,
  STARKNET_OFFSET,
} from "@/constants";
import { useVenom } from "@/contexts/useVenom";
import { useAccount, useProvider } from "@starknet-react/core";
import { toast } from "react-hot-toast";
import { useContexts } from "./context";
import { CallData, cairo } from "starknet";
import BigNumber from "bignumber.js";

export const enumPool = {
  public: 1,
} as any;
const useFunctionIDO = () => {
  const { provider } = useVenom();
  const {
    setLoadingPL,
    setLoadingHD,
    dataCMS,
    onShowModalMintSuccess,
    getDataServer,
  }: any = useContexts();

  const attributes = dataCMS?.attributes;
  const pricePublic = attributes?.pricePublic;
  const { provider: starknetProvider } = useProvider();
  const { account } = useAccount();

  const handleMintStarknet = async (type: any, quantity: any) => {
    try {
      const optionsMint = {
        contract: dataCMS?.attributes?.SC_collection,
        project: dataCMS?.attributes?.code,
        pool: POOL_TYPE.PUBLIC,
      };
      let value: any = 0;
      switch (type) {
        case "public":
          setLoadingPL(true);
          value = new BigNumber(pricePublic)
            .multipliedBy(STARKNET_OFFSET)
            .toString();
          break;
        default:
          break;
      }
      let multiCall = {} as any;
      if (quantity == 1) {
        multiCall = await account?.execute([
          {
            contractAddress: optionsMint.contract,
            entrypoint: "mint",
            calldata: CallData.compile({}),
          },
        ]);
      }

      const receipt: any = await starknetProvider?.waitForTransaction(
        multiCall?.transaction_hash as any
      );
      console.log(receipt);
      if (receipt?.execution_status === "SUCCEEDED") {
        await getDataServer();
        toast.success("Mint success!");
        onShowModalMintSuccess();
      } else {
        toast.error("Mint failed!");
      }
      console.log(receipt);
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      switch (type) {
        case "public":
          setLoadingPL(false);
          break;
        case "holder":
          setLoadingHD(false);
          break;
        default:
          break;
      }
    }
  };

  return {
    handleMintStarknet,
  };
};
export default useFunctionIDO;
