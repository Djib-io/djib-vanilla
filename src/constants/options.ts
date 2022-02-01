import { Option } from "../components/Dropdown";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";

export const networkOptions: Option[] = [
  {
    value: WalletAdapterNetwork.Mainnet.valueOf(),
    label: "Mainnet",
  },
  {
    value: WalletAdapterNetwork.Devnet.valueOf(),
    label: "Devnet",
  },
  {
    value: WalletAdapterNetwork.Testnet.valueOf(),
    label: "Testnet",
  },
];

export const walletMenu: Option[] = [
  {
    value: "copy",
    label: "Copy address",
  },
  {
    value: "change",
    label: "Change wallet",
  },
  {
    value: "disconnect",
    label: "Disconnect",
  },
];
