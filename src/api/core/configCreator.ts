import {AxiosRequestConfig, AxiosRequestHeaders, Method} from "axios";
import {urlJoiner} from "../../utils/urlJoiner";

export type ApiConfigCreatorOption = {
    baseurl: string,
    scope?: string
}

export type ApiConfigOptions = Omit<AxiosRequestConfig<any>, 'url' | 'method' | 'data' | 'headers' | 'params'>

export interface ReqConfig {
    _path?: string
    _method: Method
    _url: URL
    _data?: any
    _params?: any
    _options?: Object
    _headers?: Object

    get(url?: string): this

    post(url?: string): this

    put(url?: string): this

    delete(url?: string): this

    data(object: any): this

    options(data: Object): this

    params(data: any): this

    headers(data: AxiosRequestHeaders): this

    create(): AxiosRequestConfig
}

export type ApiConfig = {
    config: () => ReqConfig
}

export function apiConfigCreator({baseurl, scope = ''}: ApiConfigCreatorOption): ApiConfig {
    return {
        config: () => apiConfig(baseurl, scope)
    }
}

export function apiConfig(baseurl: string, scope= ''): ReqConfig {
    return {
        _url: new URL(urlJoiner(baseurl, scope)),
        _method: 'get',
        get(url?: string) {
            this._path = url || ''
            this._method = 'get'
            return this
        },
        post(url?: string) {
            this._path = url || ''
            this._method = 'post'
            return this
        },
        put(url?: string) {
            this._path = url || ''
            this._method = 'put'
            return this
        },
        delete(url?: string) {
            this._path = url || ''
            this._method = 'delete'
            return this
        },
        data(object: any) {
            this._data = object
            return this
        },
        params(params: any) {
            this._params = params
            return this
        },
        options(options: ApiConfigOptions) {
            this._options = options
            return this
        },
        headers(headers: AxiosRequestHeaders) {
            this._headers = headers
            return this
        },
        create(): AxiosRequestHeaders {
            const url = new URL(this._url.toString())
            url.pathname += this._path
            return {
                url: url.toString(),
                method: this._method,
                ...(this._data && {data: this._data}),
                ...(this._headers && {headers: this._headers}),
                ...(this._params && {params: this._params}),
                ...(this._options || {})
            }
        }
    }
}
