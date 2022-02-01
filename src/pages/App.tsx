import Box from "../components/Box";
import Boxes from "../components/Boxes";
import ConnectWallet from "../components/ConnectWallet";
import Header from "../components/Header";
import Nav from "../components/Nav";
import BoxBrowser from "../providers/BoxBrowser";
import "./../styles/App.css";
import Upload from "../components/Upload";
import {useWallet} from "@solana/wallet-adapter-react";

function App() {

    const {connected} = useWallet()

  return (
    <div className="app">
      <Nav />
      <Header />
      <BoxBrowser defaultPath='connect-wallet'>
        <Boxes forceChangePath={!connected ? 'connect-wallet' : 'upload'}>
          <Box path="connect-wallet" element={<ConnectWallet />} />
          <Box path="upload" element={<Upload />} />
        </Boxes>
      </BoxBrowser>
    </div>
  );
}

export default App;
