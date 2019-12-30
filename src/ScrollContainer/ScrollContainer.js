import React, { Component } from 'react';
import Animated from 'react-native-reanimated';
import PropTypes from 'prop-types';
import { PanGestureHandler, NativeViewGestureHandler } from 'react-native-gesture-handler';
import { ScrollWrapper } from './ScrollContainer.style';
import { PanContext } from '../PanContext';


const { call, event, Value } = Animated;

global.reanimatedScroll = new Value(0);
global.reanimatedPan = new Value(0);

class ScrollContainer extends Component {

    static contextType = PanContext;
    constructor(props) {
        super(props);
        this.state = {
            shouldScroll: true,
            scrollState: 0,
        };
        this.calculatePan = this.calculatePan.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handlePan = this.handlePan.bind(this);
        this.scroller = React.createRef();
        this.listRef = React.createRef();
        this.panRef = React.createRef();

        this.onScroll = event(
            [{ nativeEvent: { contentOffset: { y: reanimatedScroll } } }]
        );
        this.onPanGestureEvent = event(
            [{ nativeEvent: { translationY: reanimatedPan } }]
        );

    }

    calculatePan = panDistance => {
        const { setPanDistance } = this.context;
        setPanDistance(panDistance);
    };

    handlePan = (pan) => {
        if(pan[0] > 0 && this.state.scrollState === 0){
            this.calculatePan(pan[0]);
            const { setPanReleased } = this.context;
            setPanReleased(false);
            this.setState({ shouldScroll: false });
        }
    };


    handleScroll = (evt) => {
        const { setScroll } = this.context;
        setScroll(evt[0]);
        this.setState({ scrollState: evt[0] });
    };


    onHandlerStateChange = (evt) => {
        if(evt.nativeEvent.state === 5){
            const { setPanReleased } = this.context;
            setPanReleased(true);
            this.setState({ shouldScroll: true });
        }
    };


    render() {
        return (
            <ScrollWrapper>
                <Animated.Code>
                    {
                        () => call([reanimatedScroll], this.handleScroll)
                    }
                </Animated.Code>
                <Animated.Code>
                    {
                        () => call([reanimatedPan], this.handlePan)
                    }
                </Animated.Code>
                <PanGestureHandler
                    ref={this.panRef}
                    onGestureEvent={this.onPanGestureEvent}
                    simultaneousHandlers={this.listRef}
                    onHandlerStateChange={this.onHandlerStateChange}
                >
                    <Animated.View>
                    <NativeViewGestureHandler
                        ref={this.listRef}
                        simultaneousHandlers={this.panRef}
                        enabled={this.state.shouldScroll}
                    >
                        <Animated.ScrollView
                            ref={this.scroller}
                            scrollEventTrottle={16}
                            onScroll={this.onScroll}
                        >
                            {React.cloneElement(this.props.children, {
                                scrollEnabled: false,
                                style: {paddingTop: this.props.headerHeight}
                            })}
                        </Animated.ScrollView>
                    </NativeViewGestureHandler>
                    </Animated.View>
                </PanGestureHandler>
            </ScrollWrapper>
        );
    }
}

ScrollContainer.propTypes = {
    children: PropTypes.node,
    headerHeight: PropTypes.number,
};

export default ScrollContainer;
