import {apiConfigCreator} from "../core/configCreator";
import {jsonRPC} from "../core/jsonRPC";


const api = apiConfigCreator()
const jsonrpc = jsonRPC(api)


export const createPaymentReqConfig = (size: number, filenames: string[]) => jsonrpc.config()
    .method('createPayment')
    .params({size, unit: 'KB'}, filenames)
    .create()

export const uploadReqConfig = (data: FormData) => api.config()
    .post('/upload')
    .data(data)
    .create()