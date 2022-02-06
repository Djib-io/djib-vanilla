import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {useCallback, useState} from "react";
import useAbortableEffect from "./useAbortableEffect";


export type FetchOptions = {
    afterMount?: boolean,
    responseSelector?: (res?: AxiosResponse) => any
}

function useFetch(config?: AxiosRequestConfig, options?: FetchOptions) {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<AxiosResponse | undefined>()
    const [error, setError] = useState<AxiosError | undefined>()

    const basicFetch = useCallback((
        reqConfig: AxiosRequestConfig,
        status = true
    ) => (resolve?: (value: any) => any, reject?: (value: any) => any) => {
        setLoading(true)
        setResponse(undefined)
        setError(undefined)
        axios(reqConfig).then(res => {
            if (resolve) resolve(res)
            if (status) {
                setResponse(res)
                setLoading(false)
            }
        }).catch(error => {
            if (reject) reject(error)
            if (status) {
                setError(error)
                setLoading(false)
            }
        })
    }, [])

    const fetch = useCallback((_config, status) => {
        basicFetch(_config || config, status)()
    }, [config, basicFetch])

    const asyncFetch = useCallback((_config) => new Promise(basicFetch(_config || config)), [config, basicFetch])

    useAbortableEffect((status) => {
        if (options?.afterMount)
            fetch(null, status)
        // eslint-disable-next-line
    }, [])


    const parseResponse = useCallback((res) => {
        if (!options?.responseSelector) return res
        try {
            return options.responseSelector(res)
        } catch (e) {
            return res
        }
    }, [options])


    return {loading, response: parseResponse(response), error, fetch, asyncFetch}
}

export default useFetch;