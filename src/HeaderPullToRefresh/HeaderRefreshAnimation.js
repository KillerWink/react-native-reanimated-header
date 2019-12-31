import React, { useState, useEffect, useContext } from 'react';
import LottieView from "lottie-react-native";
import { Dimensions, Animated, Easing, View } from "react-native";
import changeSVGColor from '@killerwink/lottie-react-native-color';
import { DEFAULT_PROPS_ANIMATED_REFRESH } from './config';
import { usePanAnimation } from '../PanContext';

const HeaderRefreshAnimation = ({ options }) => {

    const { panDistance, panReleased } = usePanAnimation();
    const [ progress ] = useState(new Animated.Value(0));
    const [ refresh, setRefresh ] = useState(false);
    const [ released, setReleased ] = useState(false);

    let header = React.createRef();

    const {
        headerSVG = DEFAULT_PROPS_ANIMATED_REFRESH.headerSVG,
        backgroundColor = DEFAULT_PROPS_ANIMATED_REFRESH.backgroundColor,
        releaseFrame = DEFAULT_PROPS_ANIMATED_REFRESH.releaseFrame,
        startFrame = DEFAULT_PROPS_ANIMATED_REFRESH.startFrame,
        refreshFrame = DEFAULT_PROPS_ANIMATED_REFRESH.refreshFrame,
        totalFrames = DEFAULT_PROPS_ANIMATED_REFRESH.totalFrames,
        panPullDistance = DEFAULT_PROPS_ANIMATED_REFRESH.panPullDistance,
        bottomPosition = DEFAULT_PROPS_ANIMATED_REFRESH.bottomPosition,
    } = options;

    // new

    const startFrameFloat = startFrame/totalFrames;
    const refreshFrameFloat = refreshFrame/totalFrames;
    const releaseFrameFloat = releaseFrame/totalFrames;

    //const progress = new Animated.Value(0);

    const progressSetter = (progressValue) => {
        progress.setValue(parseFloat(progressValue.toFixed(2)));
    };

    //////////////////
    /// Start pull ///
    //////////////////

    const calculateStartAnimation = (animationPercentage) => {
        const parsedPercentage = startFrameFloat + (animationPercentage/panPullDistance);
        if (parsedPercentage >= refreshFrameFloat) {
            setRefresh(true);
        } else {
            setRefresh(false);
            progressSetter(parsedPercentage);
        }
    };

    useEffect(() => {
        calculateStartAnimation(panDistance);
    }, [panDistance]);


    //////////////////////
    /// End Start pull ///
    //////////////////////

    //////////////////////
    ////// release ///////
    //////////////////////


    const calculateReleaseAnimation = () => {
        Animated.timing(
            progress,
            {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }
        ).start(() => { setReleased(false); });
    };

    useEffect(() => {
        if(panReleased && !refresh){
            setReleased(true);
            calculateReleaseAnimation();
        }
    }, [panReleased]);


    //////////////////////
    //// end release /////
    //////////////////////

    //////////////////////
    ////// refresh ///////
    //////////////////////

    const loopRefreshAnimation = () => {
        progressSetter(refreshFrameFloat);
        Animated.loop(
            Animated.timing(
                progress,
                {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }
            )).start(() => {console.log('here')});
    };

    useEffect(() => {
        if(refresh){
            progressSetter(refreshFrameFloat);
            loopRefreshAnimation();
        }
    }, [refresh]);

    //////////////////////
    //// end refresh //////
    //////////////////////


    // end new

    const animationWidth = Dimensions.get('window').width;

    return (
        <View style={{ position: 'absolute', bottom: bottomPosition, width: animationWidth }}>
        <LottieView
            ref={header}
            style={{
                width: animationWidth,
                position: 'absolute',
            }}
            progress={progress}
            source={changeSVGColor(headerSVG, backgroundColor)}
        />
        </View>
    );
};

export default HeaderRefreshAnimation;
