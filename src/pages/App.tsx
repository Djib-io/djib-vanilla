import Box from "../components/Box";
import Boxes from "../components/Boxes";
import ConnectWallet from "../components/ConnectWallet";
import Header from "../components/Header";
import Nav from "../components/Nav";
import BoxBrowser from "../providers/BoxBrowser";
import "./../styles/App.css";

function App() {
  return (
    <div className="app">
      <Nav />
      <Header />
      <BoxBrowser defaultPath='connect-wallet'>
        <Boxes>
          <Box path="connect-wallet" element={<ConnectWallet />} />
        </Boxes>
      </BoxBrowser>
    </div>
  );
}

export default App;
