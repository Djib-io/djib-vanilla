import {apiConfigCreator} from "../core/configCreator";
import {jsonRPC} from "../core/jsonRPC";


const api = apiConfigCreator({baseurl: process.env.REACT_APP_API_BASE_URL as string})
const jsonrpc = jsonRPC(api)


export const estimateReqConfig = (size: number) => jsonrpc.config()
    .method('estimate')
    .params({size, unit: 'kb'})
    .create()

export const createPaymentReqConfig = (size: number, filenames: string[]) => jsonrpc.config()
    .method('createPayment')
    .params({size, unit: 'KB'}, filenames)
    .create()