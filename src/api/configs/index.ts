import {apiConfigCreator} from "../core/configCreator";
import {jsonRPC} from "../core/jsonRPC";


const api = apiConfigCreator({baseurl: process.env.REACT_APP_API_BASE_URL as string})
const jsonrpc = jsonRPC(api)


export const estimateReqConfig = (size: number) => jsonrpc.config()
    .method('estimate')
    .params({size, unit: 'kb'})
    .create()