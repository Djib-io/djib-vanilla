import React from 'react';
import { useBoxDispatch } from "../providers/BoxBrowser";

function Upload() {
    const {navigate} = useBoxDispatch()

    return (
        <div>
            upload
            <button onClick={() => navigate('connect-wallet')}>change</button>
        </div>
    );
}

export default Upload;