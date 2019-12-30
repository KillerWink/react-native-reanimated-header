import React, { Component } from 'react';
import Animated from 'react-native-reanimated';


const { cond, set, lessThan } = Animated;

class ScrollableHeader extends Component {

    constructor(props) {
        super(props);

        this.headerDiffClamp = Animated.diffClamp(set(reanimatedScroll, cond(lessThan(reanimatedScroll, 0), 0, reanimatedScroll)), 0, 100);

        this.headerTranslate = Animated.interpolate(this.headerDiffClamp, {
            inputRange: [0, 100],
            outputRange: [0, -100],
            extrapolate: 'clamp',
        });
    }

    render() {
        return (
            <Animated.View
                style={{
                    transform: [{translateY: this.headerTranslate}],
                    height: 0,
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}


export default ScrollableHeader;
