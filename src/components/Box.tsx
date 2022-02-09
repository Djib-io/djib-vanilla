import React, {useEffect} from "react";
import { useBox} from "../providers/BoxBrowser";
import {useTransition, animated, useSpring} from "@react-spring/web";
import styles from "./../styles/modules/Box.module.scss";
import Loading from "./Loading";
import StatusBox from "./StatusBox";

export type BoxProps = {
    path: string;
    element: React.ReactElement;
};


const animationConfig = {
    from: {opacity: 0, scale: 0.4},
    enter: {opacity: 1, scale: 1, x: 0},
    leave: {opacity: 0, scale: 0.4},
    delay: 0,
    config: {
        tension: 120,
        friction: 14,
    },
}

function Box({path, element}: BoxProps) {
    const {path: currentPath, status, message} = useBox();

    const transitions = useTransition(path === currentPath, animationConfig);

    const loadingTransitions = useTransition(status === 'loading', animationConfig);
    const errorTransitions = useTransition(status === 'error', animationConfig);
    const successTransitions = useTransition(status === 'success', animationConfig);


    const [contentAnimatedStyles, api] = useSpring(() => ({opacity: status !== 'normal' ? 0 : 1}));

    useEffect(() => {
        api.start({
            opacity: status !== 'normal' ? 0 : 1,
        });
    }, [api, status])


    return transitions(
        (_styles, show) =>
            show && (
                <animated.div className={styles.box} style={{..._styles}}>
                    <animated.div
                        className={styles.normal}
                        style={{opacity: contentAnimatedStyles.opacity}}>
                        {element}
                    </animated.div>

                    {loadingTransitions((loadingStyles, showLoading) => showLoading && (
                        <animated.div
                            className={styles.loading}
                            style={loadingStyles}>
                            <Loading/>
                        </animated.div>
                    ))}

                    {errorTransitions((errorStyles, showError) => showError && (
                        <animated.div
                            className={styles.error}
                            style={errorStyles}>
                            <StatusBox status={'error'} message={message}/>
                        </animated.div>
                    ))}

                    {successTransitions((successStyles, showSuccess) => showSuccess && (
                        <animated.div
                            className={styles.success}
                            style={successStyles}>
                            <StatusBox status={'success'} message={message}/>
                        </animated.div>
                    ))}
                </animated.div>
            )
    );
}

export default Box;