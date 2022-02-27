import Box from "../components/Box";
import Boxes from "../components/Boxes";
import ConnectWallet from "../components/ConnectWallet";
import Header from "../components/Header";
import Nav from "../components/Nav";
import BoxBrowser from "../providers/BoxBrowser";
import "./../styles/App.css";
import UploadComponent from "../components/Upload";
import {useWallet} from "@solana/wallet-adapter-react";
import Upload from "../providers/Upload";
import UploadResultComponent from "./../components/UploadResult";

function App() {

    const {connected} = useWallet()

    return (
        <div className="app" style={{ zIndex: 2, position: 'relative' }}>
            <Nav/>
            <Header/>
            <Upload>
                <BoxBrowser defaultPath='connect-wallet'>
                    <Boxes forceChangePath={!connected ? 'connect-wallet' : 'upload'}>
                        <Box path="connect-wallet" element={<ConnectWallet/>}/>
                        <Box path="upload" element={<UploadComponent/>} />
                        <Box path="result-upload" element={<UploadResultComponent />} />
                    </Boxes>
                </BoxBrowser>
            </Upload>
        </div>
    );
}

export default App;
