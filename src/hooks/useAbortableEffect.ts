import {DependencyList, useEffect} from 'react';

type Status = {
    aborted?: boolean
}

function useAbortableEffect(effect: (status: Status) => (void | (() => any)), deps?: DependencyList) {
    const status: Status = {};
    useEffect(() => {
        status.aborted = false;
        const cleanUpFn = effect(status);
        return () => {
            status.aborted = true;
            if (cleanUpFn)
                cleanUpFn();

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export default useAbortableEffect;