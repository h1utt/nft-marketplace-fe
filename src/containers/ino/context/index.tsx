/* eslint-disable react-hooks/exhaustive-deps */
import { useVenom } from "@/contexts/useVenom";
import { getINOUser } from "@/service/ino";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";
import useShowModal from "@/hooks/useShowModal";
import { useProvider } from "@starknet-react/core";
import { Contract } from "starknet";
import { useApplicationContext } from "@/contexts/useApplication";
import useMounted from "@/hooks/useMounted";
import collection_1 from "../../../json/collection_1.json";
import collection_2 from "../../../json/collection_2.json";
import collection_3 from "../../../json/collection_3.json";

export const INOContext = createContext([]);
export const useContexts = () => useContext(INOContext);
export const Provider = ({ children }: any) => {
  const { provider, isInitializing } = useVenom();
  const [dataCMS, setDataCMS] = useState<any>({});
  const [loadingPL, setLoadingPL] = useState(false);
  const [loadingPV, setLoadingPV] = useState(false);
  const [loadingWL, setLoadingWL] = useState(false);
  const [loadingHD, setLoadingHD] = useState(false);
  const [accNftData, setAccNFTData] = useState<any>(0);
  const [nftDataPool, setNFTDataPool] = useState<any>(0);
  const [nftDataPoolSV, setNFTDataPoolSV] = useState<any>(0);
  const [nftMinted, setNftMinted] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const { provider: starknetProvider } = useProvider();

  const [mintedByPool, setMintedByPool] = useState<any>({});

  const [comment, setComment] = useState<any>({ data: [], nextPage: false });

  const { isAuthenticated } = useApplicationContext();
  const { isMounted } = useMounted();

  const {
    showModal: showModalMintSuccess,
    onHide: onHideModalMintSuccess,
    onShow: onShowModalMintSuccess,
  } = useShowModal();
  const router = useRouter();
  const id = router.query.id;

  const getDataCMS = async () => {
    try {
      let all = [] as any;
      if (id == "collection_1") {
        all = collection_1;
      } else if (id == "collection_2") {
        all = collection_2;
      } else if (id == "collection_3") {
        all = collection_3;
      }
      setDataCMS(all);
    } catch (ex) {
      console.log(ex);
    }
  };

  const getDataServer = async () => {
    const options = {
      project: id,
    };
    const dataUser = await getINOUser([]);
    setAccNFTData(dataUser?.data?.data || {});
  };

  const getDataOnchain = async () => {
    try {
      if (dataCMS?.attributes?.SC_collection) {
        let total = 0 as any;

        const { abi } = await starknetProvider.getClassAt(
          dataCMS?.attributes?.SC_collection
        );
        const collectionContract = new Contract(
          abi,
          dataCMS?.attributes?.SC_collection,
          starknetProvider
        );

        const dataTotal = await collectionContract.get_sum_pool();
        setMintedByPool({
          public: dataTotal[1],
        });
        total = Number(dataTotal[0]);
        setNFTDataPool(total);
      }
    } catch (ex) {
      // console.log(ex);
    }
  };

  useEffect(() => {
    getDataOnchain();
  }, [dataCMS?.attributes?.SC_collection]);

  useEffect(() => {
    let interval: any;
    interval = setInterval(() => getDataOnchain(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [dataCMS?.attributes?.SC_collection, isInitializing]);

  useEffect(() => {
    id && isMounted && getDataCMS();
  }, [id, isMounted]);

  useEffect(() => {
    isAuthenticated && isMounted && getDataServer();
  }, [isAuthenticated, isMounted]);

  const value: any = useMemo(() => {
    const loadMoreChat = () => {
      setPagination({
        ...pagination,
        limit: pagination.limit + 10,
      });
    };
    return {
      dataCMS,
      loadingHD,
      setLoadingHD,
      loadingWL,
      setLoadingWL,
      loadingPV,
      setLoadingPV,
      loadingPL,
      setLoadingPL,
      accNftData,
      nftDataPool,
      setAccNFTData,
      setNFTDataPool,
      nftMinted,
      setNftMinted,
      showModalMintSuccess,
      onHideModalMintSuccess,
      onShowModalMintSuccess,
      nftDataPoolSV,
      getDataServer,
      mintedByPool,
      setMintedByPool,
      comment,
      setComment,
      loadMoreChat,
      pagination,
      setPagination,
    };
  }, [
    dataCMS,
    loadingHD,
    setLoadingHD,
    loadingWL,
    setLoadingWL,
    loadingPV,
    setLoadingPV,
    loadingPL,
    setLoadingPL,
    accNftData,
    nftDataPool,
    nftMinted,
    setNftMinted,
    showModalMintSuccess,
    onHideModalMintSuccess,
    onShowModalMintSuccess,
    nftDataPoolSV,
    mintedByPool,
    setMintedByPool,
    comment,
    setComment,
    pagination,
    setPagination,
  ]);

  return <INOContext.Provider value={value}>{children}</INOContext.Provider>;
};
