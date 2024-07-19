import React from "react";
import { mainnet, goerli } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  blastProvider,
  jsonRpcProvider,
} from "@starknet-react/core";

interface IStarknetNetworkProps {
  children: any;
}
const StarknetProvider = ({ children }: IStarknetNetworkProps) => {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
  });
  return (
    <StarknetConfig
      connectors={connectors}
      autoConnect
      chains={[mainnet]}
      provider={jsonRpcProvider({
        rpc: () => ({
          nodeUrl:
            "https://starknet-mainnet.blastapi.io/22a201b5-9702-4020-8932-b7ed87168174/rpc/v0_7",
        }),
      })}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
};

export default StarknetProvider;
