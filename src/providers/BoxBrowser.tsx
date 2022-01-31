import React, {createContext, useCallback, useContext, useReducer} from "react";
import { Actions } from "./types";


export type BoxBrowserState = {
    path: string,
}


const initialValue = { path: '' }

const BoxBrowserContext = createContext<BoxBrowserState>(initialValue)
const BoxBrowserDispatchContext = createContext<React.Dispatch<any>>(() => null)


type BoxBrowserActionsMap = {
    setPath: string
}


function reducer(state:BoxBrowserState, action: Actions<BoxBrowserActionsMap>) {
    switch(action.type) {
        case 'setPath':
            return {...state, path: action.payload }
        default:
            throw new Error(`[${action.type}] type does not exist in 'BoxBrowserActions'.`)
      
    }
}


const BoxBrowser:React.FC<{defaultPath: string}> = ({ children, defaultPath }) => {
    const [state, dispatch] = useReducer(reducer, { path: defaultPath })

  return (
  <BoxBrowserDispatchContext.Provider value={dispatch}>
      <BoxBrowserContext.Provider value={state}>
          {children}
      </BoxBrowserContext.Provider>
  </BoxBrowserDispatchContext.Provider>
  );
}

export default BoxBrowser;


export const useBox = () => useContext(BoxBrowserContext)

export const useBoxDispatch = () => {
    const dispatch = useContext(BoxBrowserDispatchContext)

    const navigate = useCallback((path: string) => {
        dispatch({
            type: 'setPath',
            payload: path
        })
    }, [dispatch])

    return {navigate};
}
