/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTransaction, parseURL } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import BigNumber from "bignumber.js";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useBoxDispatch } from "../providers/BoxBrowser";
import { useDjibConnection } from "../providers/DjibConnectionProvider";
import { useUpload } from "../providers/Upload";
import { AttributeType, FamilyType } from "../utils/djibConnection";
import { sleep } from "../utils/sleep";
import { toBase64 } from "../utils/toBase64";
import styles from "./../styles/modules/MintOne.module.scss";
import Button from "./Button";
import Input from "./Input";
import InputWithDropdown from "./InputWithDropdown";
import KeyValueInput, { AttrType } from "./KeyValueInput";
import Loading from "./Loading";
import { ReactComponent as Logo } from "./../assets/images/icon-logo.svg";

function MintOne() {
  const [name, setName] = useState("");
  const upload = useUpload();
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File>();
  const [symbol, setSymbol] = useState("");
  const [sellerFee, setSellerFee] = useState<string | number>("");
  const [externalUrl, setExternalUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [attrs, setAttrs] = useState<AttributeType[]>([]);
  const [family, setFamily] = useState("");
  const [collection, setCollection] = useState("");
  const [familyOptions, setFamilyOptions] = useState<FamilyType[]>([]);
  const djibConn = useDjibConnection();
  const { publicKey: payer, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { updateStatus } = useBoxDispatch();
  const [loading, setLoading] = useState(true);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const handleChangeAttr = useCallback((data: AttrType[]) => {
    setAttrs(
      data.map((item) => ({ trait_type: item.attr, value: item.value }))
    );
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    (async () => {
      if (
        upload &&
        ["jpeg", "png", "svg+xml", "apng", "avif", "webp", "gif", "jpg"].includes(
          upload[1] || ""
        )
      ) {
        try {
          // const download = await axios(upload[0]);
          setLoading(false);
          setThumbnail(upload[0]);
        } catch (e) {}
      } else {
        setLoading(false);
      }
    })();
    if (!upload) {
      timeout = setTimeout(() => {
        setName("");
        setSymbol("");
        setAttrs([]);
        setDesc("");
        setFamily("");
        setSellerFee("");
        setExternalUrl("");
        setCollection("");
        setThumbnail("");
        setThumbnailFile(undefined);
        setFamilyOptions([]);
        setLoading(true);
      }, 100);
    } else {
      (async () => {
        try {
          const { result } = await djibConn.lsNftFamilies();
          setFamilyOptions(result);
        } catch (e) {
          console.log({ e });
        }
      })();
    }

    return () => clearTimeout(timeout);
  }, [djibConn, upload]);

  const handleGetThumbnail = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files && e.target.files[0];
      if (
        f &&
        [
          "jpeg",
          "png",
          "svg+xml",
          "apng",
          "avif",
          "webp",
          "gif",
          "jpg",
        ].includes(f.type.split("/")[1])
      ) {
        setThumbnail(await toBase64(f));
        setThumbnailFile(f);
      }
    },
    []
  );

  const collectionOptions = useMemo(
    () =>
      familyOptions
        .find((item) => item.family === family)
        ?.collections.map((item) => ({ value: item, label: item })) || [],
    [family, familyOptions]
  );

  const _familyOptions = useMemo(
    () =>
      familyOptions.map((item) => ({
        value: item.family,
        label: item.family,
      })),
    [familyOptions]
  );

  const handleSaveClick = useCallback(async () => {
    if (
      name &&
      symbol &&
      sellerFee !== undefined &&
      externalUrl &&
      desc &&
      attrs.length &&
      collection &&
      family &&
      payer &&
      signTransaction
    ) {
      updateStatus("loading");
      try {
        let cidThumbnail: string | undefined = undefined;
        if (thumbnailFile) {
          const data: any = await djibConn.upload({
            files: [thumbnailFile],
            publicKey: payer.toBase58(),
          });
          cidThumbnail =
            data.result[0].split("/")[data.result[0].split("/").length - 1];
        }

        const {
          result: { cid, created_at },
        } = await djibConn.saveAsNft(
          upload[0].split("/")[upload[0].split("/").length - 1],
          {
            thumbnail: null,
            name,
            symbol,
            seller_fee_basis_points: Number(sellerFee),
            external_url: externalUrl,
            description: desc,
            attributes: attrs,
            family: family,
            collection,
          }
        );

        const {
          result: { payment_url, tracking_code },
        } = await djibConn.createNftPayment();
        // setTrackingCode(tracking_code);
        const { recipient, amount, splToken, reference, memo } =
          parseURL(payment_url);
        const tx = await createTransaction(
          connection,
          payer,
          recipient,
          amount as BigNumber,
          {
            splToken,
            memo,
            reference,
          }
        );

        tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
        tx.feePayer = payer;

        const signedTransaction = await signTransaction(tx);
        await connection.sendRawTransaction(signedTransaction.serialize());

        let finalized = false;
        while (!finalized) {
          const confirm = await djibConn.confirmPayment(tracking_code);
          finalized = confirm.result.finalized;
          if (!finalized) await sleep(2000);
        }
        await djibConn.uploadAsset(cid, created_at, tracking_code);
        updateStatus("success");
      } catch (e: any) {
        updateStatus("error", e?.data);
      }
    }
  }, [
    attrs,
    collection,
    connection,
    desc,
    djibConn,
    externalUrl,
    family,
    name,
    payer,
    sellerFee,
    signTransaction,
    symbol,
    thumbnailFile,
    updateStatus,
    upload,
  ]);

  return (
    <div>
      <div className={styles.thumbnail}>
        {loading ? (
          <div style={{ width: 100, height: 110 }}>
            <Loading />
          </div>
        ) : (
          <>
            {!thumbnail && <Logo width={100} height={100} />}
            {!!thumbnail && (
              <div className={styles.image}>
                <img src={thumbnail} alt="thumbnail" />
              </div>
            )}
          </>
        )}

        <div>
          <p>Thumbnail</p>
          {![
            "jpeg",
            "png",
            "svg+xml",
            "apng",
            "avif",
            "webp",
            "gif",
            "jpg",
          ].includes(upload[1] || "") && (
            <button className="edit-thumbnail" onClick={() => thumbnailRef.current?.click()}>
              Edit thumbnail
            </button>
          )}

          <input
            type="file"
            hidden={true}
            ref={thumbnailRef}
            accept="image/*"
            onChange={handleGetThumbnail}
          />
        </div>
      </div>
      <div className={styles.inputs}>
        <Input
          placeholder="Name"
          value={name}
          maxLength={32}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Symbol"
          value={symbol}
          maxLength={10}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <Input
          placeholder="Seller fee"
          type="number"
          value={sellerFee}
          onChange={(e) =>
            e.target.value === ""
              ? setSellerFee("")
              : setSellerFee(Math.min(Math.max(0, Number(e.target.value)), 100))
          }
        />
        <Input
          placeholder="External url"
          value={externalUrl}
          maxLength={70}
          onChange={(e) => setExternalUrl(e.target.value)}
        />
        <Input
          onChange={(e) => setDesc(e.target.value)}
          containerClassName={styles.desc}
          textarea={true}
          value={desc}
          maxLength={1024}
          placeholder="Description..."
        />
      </div>
      <div style={{ width: 441 }}>
        <KeyValueInput onChange={handleChangeAttr} />
      </div>
      <div className={styles.dropdowns}>
        <InputWithDropdown
          onChange={(value) => {
            setCollection("");
            setFamily(value);
          }}
          options={_familyOptions}
          inputProps={{
            placeholder: "Family",
            fullWidth: true,
          }}
          optionsStyle={{
            maxHeight: 100,
          }}
        />

        <InputWithDropdown
          onChange={(value) => setCollection(value)}
          options={collectionOptions}
          inputProps={{
            placeholder: "Collection",
            fullWidth: true,
          }}
          optionsStyle={{
            maxHeight: 100,
          }}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <Button
          onClick={handleSaveClick}
          // fullWidth={true}
          // withLoading={true}
          isDisabled={
            !(
              name &&
              symbol &&
              sellerFee !== undefined &&
              externalUrl &&
              desc &&
              attrs.length &&
              collection &&
              family &&
              payer &&
              signTransaction
            )
          }
        >
          Mint
        </Button>
      </div>
    </div>
  );
}

export default MintOne;
