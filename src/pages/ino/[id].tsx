import INODetailContainer from "@/containers/ino";
import { Provider } from "@/containers/ino/context";
import React from "react";

const INODetail = () => {
  return (
    <Provider>
      <INODetailContainer />
    </Provider>
  );
};

export default INODetail;
