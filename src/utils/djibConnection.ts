import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import bs58 from "bs58";

export type JsonRPCErrorType = {
  code: number;
  message: string;
  data: string;
};

export type JsonRPCResponse<T> = {
  jsonrpc: string;
  id: number;
  result: T;
};

export type FamilyType = {
  collections: string[];
  family: string;
};

export type AttributeType = { trait_type: string; value: string };

export type PaymentType = {
  pay_public_key: string;
  price: number;
  amount: string;
  status: "finalized" | "sold" | "pending" | "failed";
  signature: string;
  payed_at: string;
  created_at: string;
  updated_at: string;
};

export type ShareObjectType = {
  link: string;
  has_pass: boolean;
  is_public: boolean;
  share_email: string;
  created_at: string;
};

export type FileType = {
  file_name: string;
  extension: string | null;
  size_byte: number;
  is_folder: boolean;
  locked?: boolean;
  parent: string;
  path: string;
  owner?: string;
  content_type?: string;
  cid?: string;
  public_link: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type PropertiesType = {
  creators: { address: string; share: number }[];
  files: { uri: string; type: string }[];
};

export type MetadataType = {
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url: string;
  properties: PropertiesType;
  collection: {
    name: string;
    family: string;
  };
  seller_fee_basis_points: number;
  attributes: AttributeType;
};

export type NFTType = {
  token: string;
  signature: string;
  status: string;
  message: string;
  created_at: string;
  updated_at: string;
  metadata: MetadataType;
};

export type StatusType = {
  cloud: {
    used_size_kb: number;
    total_size_kb: number;
    created_at: string;
    updated_at: string;
  };
  prizes: any[];
};

export type Profile = {
  name: string;
  avatar: string;
  email: string;
  confirmation: any;
};

export type UnitType = "GB" | "KB" | "MG" | "TB";

export class DjibConnection {
  readonly url: string;
  token?: string;
  currentId: number = 0;
  logout?: () => void;

  constructor(network: string = "mainnet-beta") {
    if (network === "devnet") {
      this.url = process.env.REACT_APP_API_DEV_BASE_URL as string;
    } else {
      this.url = process.env.REACT_APP_API_MAIN_BASE_URL as string;
    }
  }

  async rpc(method: string, ...params: any[]) {
    const { data } = await axios.post(this.url, {
      jsonrpc: "2.0",
      id: this.currentId++,
      method,
      params: params.length === 0 ? null : params,
    });
    if (data.error) {
      if (data.error?.code === -32004 && this.logout) {
        this.logout();
      }
      throw data.error;
    } else return data;
  }

  async handshake(publicKey: PublicKey) {
    return (await this.rpc(
      "handshake",
      publicKey.toBase58()
    )) as JsonRPCResponse<string>;
  }

  async auth(publicKey: PublicKey, signature: Uint8Array) {
    return (await this.rpc(
      "auth",
      publicKey.toBase58(),
      bs58.encode(signature)
    )) as JsonRPCResponse<string>;
  }

  async estimate(publicKey: PublicKey, value: number, unit: UnitType = "GB") {
    return (await this.rpc(
      "estimate",
      publicKey.toBase58(),
      this.token,
      value,
      unit
    )) as JsonRPCResponse<number>;
  }

  async status() {
    return (await this.rpc(
      "status",
      this.token
    )) as JsonRPCResponse<StatusType>;
  }

  async lsDrive(path: string) {
    return (await this.rpc("lsDrive", this.token, path)) as JsonRPCResponse<
      FileType[]
    >;
  }

  async lsTrash() {
    return (await this.rpc("lsTrash", this.token)) as JsonRPCResponse<
      FileType[]
    >;
  }

  async lsFavourite() {
    return (await this.rpc("lsFavorite", this.token)) as JsonRPCResponse<
      FileType[]
    >;
  }

  async recentFiles(limit: number = 10) {
    return (await this.rpc(
      "recentFiles",
      this.token,
      limit
    )) as JsonRPCResponse<FileType[]>;
  }

  async unsetFavorite(path: string) {
    return (await this.rpc(
      "unsetFavorite",
      this.token,
      path
    )) as JsonRPCResponse<FileType[]>;
  }

  async createPayment(value: number, unit: UnitType = "GB") {
    return (await this.rpc(
      "createPayment",
      this.token,
      value,
      unit
    )) as JsonRPCResponse<{
      payment_url: string;
      tracking_code: string;
    }>;
  }

  async confirmPayment(trackingCode: string) {
    return (await this.rpc(
      "confirmPayment",
      this.token,
      trackingCode
    )) as JsonRPCResponse<{
      finalized: boolean;
    }>;
  }

  async buyStorage(trackingCode: string) {
    return (await this.rpc(
      "buyStorage",
      this.token,
      trackingCode
    )) as JsonRPCResponse<string>;
  }

  async createFolder(path: string, name: string) {
    return (await this.rpc(
      "createFolder",
      this.token,
      path,
      name
    )) as JsonRPCResponse<string>;
  }

  async claimPrize() {
    return (await this.rpc(
      "claimPrize",
      this.token
    )) as JsonRPCResponse<StatusType>;
  }

  async search(value: string, path?: string, extension?: string) {
    const option: any = {};
    if (path) option.path = path;
    if (extension) option.extension = extension;
    return (await this.rpc(
      "search",
      this.token,
      value,
      option
    )) as JsonRPCResponse<FileType[]>;
  }

  async moveTrash(path: string) {
    return (await this.rpc("moveTrash", this.token, [path])) as JsonRPCResponse<
      string[]
    >;
  }

  async restoreFromTrash(path: string, deleteAt: string) {
    return (await this.rpc(
      "restoreFromTrash",
      this.token,
      path,
      deleteAt
    )) as JsonRPCResponse<string>;
  }

  async setFavorite(path: string) {
    return (await this.rpc(
      "setFavorite",
      this.token,
      path
    )) as JsonRPCResponse<string>;
  }

  async rename(path: string, newName: string) {
    return (await this.rpc(
      "rename",
      this.token,
      path,
      newName
    )) as JsonRPCResponse<string>;
  }

  async move(from: string, to: string) {
    return (await this.rpc(
      "move",
      this.token,
      from,
      to
    )) as JsonRPCResponse<string>;
  }

  async copy(from: string, to: string) {
    return (await this.rpc(
      "copy",
      this.token,
      from,
      to
    )) as JsonRPCResponse<string>;
  }

  async duplicate(path: string) {
    return (await this.rpc(
      "duplicate",
      this.token,
      path
    )) as JsonRPCResponse<string>;
  }

  async setProfile(params: { email?: string; avatar?: string; name?: string }) {
    return (await this.rpc(
      "setProfile",
      this.token,
      params
    )) as JsonRPCResponse<string>;
  }

  async getProfile() {
    return (await this.rpc(
      "getProfile",
      this.token
    )) as JsonRPCResponse<Profile>;
  }

  async resendVerificationEmail() {
    return (await this.rpc(
      "resendVerificationEmail",
      this.token
    )) as JsonRPCResponse<string>;
  }

  async upload(
    files: FileList | File[],
    type: "private" | "public",
    path: string
  ) {
    if (!this.token) throw Error("Authorization Error");

    const formData = new FormData();
    for (let x = 0; x < files.length; x++) {
      formData.append("files[]", files[x]);
    }
    formData.append("type", type);
    formData.append("path", path);
    formData.append("token", this.token);

    const { data } = await axios({
      method: "post",
      url: `${this.url}/upload`,
      data: formData,
    });

    if (data?.error) {
      throw data?.error;
    } else {
      return data;
    }
  }

  async download(path: string) {
    if (!this.token) throw Error("Authorization Error");

    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", `${this.url}/download`);

    const pathInput = document.createElement("input");
    pathInput.setAttribute("type", "text");
    pathInput.setAttribute("hidden", "true");
    pathInput.setAttribute("name", "path");
    pathInput.value = path;

    const tokenInput = document.createElement("input");
    tokenInput.setAttribute("type", "text");
    tokenInput.setAttribute("hidden", "true");
    tokenInput.setAttribute("name", "token");
    tokenInput.value = this.token;

    form.appendChild(tokenInput);
    form.appendChild(pathInput);

    document.body.appendChild(form);

    form.submit();

    // const { data } = await axios.post(
    //   `${this.url}/download`,
    //   {
    //     token: this.token,
    //     path,
    //   },
    //   {
    //     responseType: "blob",
    //   }
    // );

    // return data as Blob;
  }

  async downloadAjax(path: string) {
    if (!this.token) throw Error("Authorization Error");
    const formData = new FormData();
    formData.append("token", this.token);
    formData.append("path", path);
    const { data } = await axios.post(`${this.url}/download`, formData, {
      responseType: "blob",
    });

    return new Promise<string>((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(data as Blob);
    });
  }

  async createNftPayment(n: number = 1) {
    return (await this.rpc(
      "createNftPayment",
      this.token,
      n
    )) as JsonRPCResponse<{
      payment_url: string;
      tracking_code: string;
    }>;
  }

  async saveAsNft(
    path: string,
    trackingCode: string,
    attrs: {
      thumbnail?: string;
      name: string;
      symbol: string;
      description: string;
      seller_fee_basis_points: number;
      external_url: string;
      attributes: AttributeType[];
      collection: string;
      family: string;
    }
  ) {
    return (await this.rpc("saveAsNft", this.token, path, trackingCode, {
      ...attrs,
      thumbnail: attrs.thumbnail || null,
    })) as JsonRPCResponse<string>;
  }

  async lsNfts(count: number = 10, skip: number = 0, family?: string) {
    return (await this.rpc("lsNfts", this.token, {
      family,
      count,
      skip,
    })) as JsonRPCResponse<{
      nfts: NFTType[];
      options: {
        family: string;
        total: number;
        skip: number;
        count: number;
      };
    }>;
  }

  async lsNftFamilies() {
    return (await this.rpc("lsNftFamilies", this.token)) as JsonRPCResponse<
      FamilyType[]
    >;
  }

  async lsPayments(count: number = 10, skip: number = 0) {
    return (await this.rpc(
      "lsPayments",
      this.token,
      skip,
      count
    )) as JsonRPCResponse<{
      payments: PaymentType[];
      options: {
        skip: number;
        total: number;
        count: number;
      };
    }>;
  }

  async shareObject(path: string, email?: string, password?: string) {
    return (await this.rpc("shareObject", this.token, path, {
      email,
      password,
    })) as JsonRPCResponse<string>;
  }

  async shareFromDrive(path: string) {
    return (await this.rpc(
      "shareFromDrive",
      this.token,
      path
    )) as JsonRPCResponse<string>;
  }

  async lsFileShares(path: string) {
    return (await this.rpc(
      "lsFileShares",
      this.token,
      path
    )) as JsonRPCResponse<{
      has_pass: boolean;
      shares: ShareObjectType[];
    }>;
  }

  async revokeShares(path: string, links: string[]) {
    return (await this.rpc(
      "revokeShares",
      this.token,
      path,
      links
    )) as JsonRPCResponse<ShareObjectType[]>;
  }

  async lsShareWithMe({
    path,
    owner,
    password,
  }: {
    path?: string | undefined;
    owner?: string;
    password?: string;
  }) {
    return (await this.rpc(
      "lsShareWithMe",
      this.token,
      path && {
        path: path.startsWith("/Shared") ? path : `/Shared${path}`,
        owner,
        password,
      }
    )) as JsonRPCResponse<FileType[]>;
  }

  async lsShareByMe() {
    return (await this.rpc("lsShareByMe", this.token)) as JsonRPCResponse<
      FileType[]
    >;
  }

  async rmSharedWithMe(path: string, owner: string) {
    return (await this.rpc(
      "rmSharedWithMe",
      this.token,
      path,
      owner
    )) as JsonRPCResponse<FileType[]>;
  }

  async downloadShared({
    path,
    link,
    password,
    owner,
  }: {
    path?: string;
    link?: string;
    password?: string;
    owner: string;
  }) {
    if (!this.token) throw Error("Authorization Error");

    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", `${this.url}/download-shared`);

    const pathInput = document.createElement("input");
    pathInput.setAttribute("type", "text");
    pathInput.setAttribute("hidden", "true");
    pathInput.setAttribute("name", "path");
    pathInput.value = path || "";

    const linkInput = document.createElement("input");
    linkInput.setAttribute("type", "text");
    linkInput.setAttribute("hidden", "true");
    linkInput.setAttribute("name", "link");
    linkInput.value = link || "";

    const passwordInput = document.createElement("input");
    passwordInput.setAttribute("type", "text");
    passwordInput.setAttribute("hidden", "true");
    passwordInput.setAttribute("name", "password");
    passwordInput.value = password || "";

    const tokenInput = document.createElement("input");
    tokenInput.setAttribute("type", "text");
    tokenInput.setAttribute("hidden", "true");
    tokenInput.setAttribute("name", "token");
    tokenInput.value = this.token;

    const ownerInput = document.createElement("input");
    ownerInput.setAttribute("type", "text");
    ownerInput.setAttribute("hidden", "true");
    ownerInput.setAttribute("name", "owner");
    ownerInput.value = owner;

    form.appendChild(tokenInput);
    form.appendChild(pathInput);
    if (link) form.appendChild(linkInput);
    form.appendChild(ownerInput);
    if (password) form.appendChild(passwordInput);

    document.body.appendChild(form);
    form.submit();
  }

  async lsPublic(path: string, flag: boolean) {
    return (await this.rpc(
      "lsPublic",
      this.token
      // flag
    )) as JsonRPCResponse<FileType[]>;
  }

  async emptyTrash() {
    return (await this.rpc(
      "emptyTrash",
      this.token
    )) as JsonRPCResponse<string>;
  }

  async deleteTrash(path: string, deleteAt?: string) {
    return (await this.rpc(
      "deleteTrash",
      this.token,
      path,
      deleteAt
    )) as JsonRPCResponse<string>;
  }

  async getSharedByLink(link: string, password?: string) {
    return (await this.rpc(
      "getSharedByLink",
      this.token,
      link,
      password && {
        password,
      }
    )) as JsonRPCResponse<FileType[]>;
  }

  async savePublic(cids: string[], path: string) {
    return (await this.rpc(
      "savePublic",
      this.token,
      cids,
      path
    )) as JsonRPCResponse<string>;
  }
}
