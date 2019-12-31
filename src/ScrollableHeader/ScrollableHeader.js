import React, { Component } from 'react';
import Animated from 'react-native-reanimated';
import { DEFAULT_PROPS_SCROLLABLE } from './config';

const { cond, set, lessThan } = Animated;

const ScrollableHeader = ({ options = {}, children }) => {

    const {
        scrollDistance = DEFAULT_PROPS_SCROLLABLE.scrollDistance,
    } = options;

    const headerDiffClamp = Animated.diffClamp(set(reanimatedScroll, cond(lessThan(reanimatedScroll, 0), 0, reanimatedScroll)), 0, scrollDistance);

    const headerTranslate = Animated.interpolate(headerDiffClamp, {
        inputRange: [0, scrollDistance],
        outputRange: [0, -scrollDistance],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View
            style={{
                transform: [{translateY: headerTranslate}],
                height: 0,
            }}
        >
            {children}
        </Animated.View>
    );
}


export default ScrollableHeader;
