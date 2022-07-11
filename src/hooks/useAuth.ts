import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useBoxDispatch } from "../providers/BoxBrowser";
import { useDjibConnection } from "../providers/DjibConnectionProvider";

type Status = "connect_wallet" | "loading" | "ok";

function useAuth() {
  const { publicKey, signMessage, connecting, disconnect, connected } =
    useWallet();
  const [status, setStatus] = useState<Status>("loading");
  const { updateStatus } = useBoxDispatch();

  const djibConn = useDjibConnection();
  const logout = useCallback(() => {
    disconnect().then().catch();
    localStorage.removeItem("token");
    localStorage.removeItem("publicKey");
    setStatus("connect_wallet");
    updateStatus("normal");
  }, [disconnect, updateStatus]);

  // useEffect(() => {
  //   alert(navigator.userAgent)
  // }, [])

  const getToken = useCallback(
    async (token?: string | null) => {
      if (!publicKey || !signMessage) {
        logout();
        return;
      }
      //   setStatus("loading");
      const login = async (token: string) => {
        try {
          djibConn.token = token;
          djibConn.logout = logout;
          localStorage.setItem("token", token);
          localStorage.setItem("publicKey", publicKey.toBase58());
          await djibConn.status();
          setStatus("ok");
          updateStatus("normal");
        } catch (e) {
          getToken();
        }
      };

      try {
        if (
          token &&
          localStorage.getItem("publicKey") === publicKey.toBase58()
        ) {
          login(token);
        } else {
          localStorage.removeItem("publicKey");
          const handshake = await djibConn.handshake(publicKey);
          const message = new TextEncoder().encode(handshake.result);
          const signature = await signMessage(message);
          const token = await djibConn.auth(publicKey, signature);
          login(token.result);
        }
      } catch (e: any) {
        if (
          e?.error?.message &&
          e?.error?.code !== -32603 &&
          e?.error?.code !== 4001
        ) {
          toast.error(e?.error?.message || "Something went wrong!");
        }
        logout();
      }
    },
    [djibConn, logout, publicKey, signMessage, updateStatus]
  );

  useEffect(() => {
    if (connecting) {
      setStatus("loading");
      updateStatus("loading");
    } else if (!connecting && !connected) {
      setStatus("connect_wallet");
      updateStatus("normal");
    }
  }, [connecting, connected, updateStatus]);

  useEffect(() => {
    if (publicKey) {
      getToken(localStorage.getItem("token"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  return {
    auth: status === "ok",
    status,
  };
}

export default useAuth;
