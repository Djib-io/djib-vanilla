import {ApiConfig} from "./configCreator";
import {AxiosRequestConfig} from "axios";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";

export type JsonRPCConfig = {
    config: () => JsonRPC
}

export interface JsonRPC {
    _method: string
    _params: any[]

    method(value: string): this
    params(...values: any[]): this
    create(jsonrpc?: string, id?: number): (network: WalletAdapterNetwork) => AxiosRequestConfig
}



export function jsonRPC(apiConfig:  ApiConfig): JsonRPCConfig {
    return {
        config: () => jsonRPCRegConfig(apiConfig)
    }
}


function jsonRPCRegConfig(apiConfig:  ApiConfig): JsonRPC{
    return {
        _method: '',
        _params: [],

        method(value: string) {
            this._method = value
            return this
        },
        params(...values: any[]) {
            this._params = values
            return this
        },
        create(jsonrpc?: string, id?: number) {
            return (network: WalletAdapterNetwork) => {
                return apiConfig.config().post().data({
                    method: this._method,
                    params: this._params,
                    jsonrpc: jsonrpc || "2.0",
                    id: id || 0
                }).create()(network)
            }
        }
    }
}