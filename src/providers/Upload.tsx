import React, {createContext, useContext, useState} from "react";


const UploadContext = createContext<string[]>([])
const UploadDispatchContext = createContext<React.Dispatch<any>>(() => null)



const UploadProvider:React.FC = ({ children }) => {
    const [state, setState] = useState([])

    return (
        <UploadDispatchContext.Provider value={setState}>
            <UploadContext.Provider value={state}>
                {children}
            </UploadContext.Provider>
        </UploadDispatchContext.Provider>
    );
}

export default UploadProvider;


export const useUpload = () => useContext(UploadContext)
export const useUploadDispatch = () => useContext(UploadDispatchContext)