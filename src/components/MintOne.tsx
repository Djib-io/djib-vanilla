import React, { useCallback, useMemo, useState } from "react";
import { AttributeType, FamilyType } from "../utils/djibConnection";
import { toBase64 } from "../utils/toBase64";
import styles from "./../styles/modules/MintOne.module.scss";
import Button from "./Button";
import Input from "./Input";
import InputWithDropdown from "./InputWithDropdown";
import KeyValueInput, { AttrType } from "./KeyValueInput";

function MintOne() {
  const [name, setName] = useState("");
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

  const handleChangeAttr = useCallback((data: AttrType[]) => {
    setAttrs(
      data.map((item) => ({ trait_type: item.attr, value: item.value }))
    );
  }, []);

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

  return (
    <div>
      <div className={styles.inputs}>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Symbol"
          value={symbol}
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
          onChange={(e) => setExternalUrl(e.target.value)}
        />
        <Input
          onChange={(e) => setDesc(e.target.value)}
          containerClassName={styles.desc}
          textarea={true}
          value={desc}
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
      <div style={{ marginTop: '1rem'}}>

      <Button
        // onClick={handleSaveClick}
        // fullWidth={true}
        // withLoading={true}
        // isDisabled={isDisabledButton}
      >
        Mint
      </Button>
      </div>
      
    </div>
  );
}

export default MintOne;
