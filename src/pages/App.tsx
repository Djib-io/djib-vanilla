import Box from "../components/Box";
import Boxes from "../components/Boxes";
import ConnectWallet from "../components/ConnectWallet";
import Header from "../components/Header";
import Nav from "../components/Nav";
import BoxBrowser from "../providers/BoxBrowser";
import "./../styles/App.css";
import UploadComponent from "../components/Upload";
import Upload from "../providers/Upload";
import UploadResultComponent from "./../components/UploadResult";
import Actions from "../components/Actions";
import MintOptions from "../components/MintOptions";
import MintOne from "../components/MintOne";
import useAuth from "../hooks/useAuth";
import MintOneUpload from "../components/MintOneUpload";
import Footer from "../components/Footer";

function App() {
  const { status } = useAuth();
  return (
    <>
      <div className="app" style={{ zIndex: 2, position: "relative" }}>
        <Nav />
        <Upload>
          <BoxBrowser defaultPath="connect-wallet">
            <Header />
            <Boxes
              forceChangePath={status !== "ok" ? "connect-wallet" : "actions"}
            >
              <Box path="connect-wallet" element={<ConnectWallet />} />
              <Box path="actions" element={<Actions />} />
              <Box path="mint-options" element={<MintOptions />} />
              <Box path="mint-one" element={<MintOne />} />
              <Box path="mint-one-upload" element={<MintOneUpload />} />
              <Box path="upload" element={<UploadComponent />} />
              <Box path="result-upload" element={<UploadResultComponent />} />
            </Boxes>
          </BoxBrowser>
        </Upload>
        <Footer />
      </div>
    </>
  );
}

export default App;
