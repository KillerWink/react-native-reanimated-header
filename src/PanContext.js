import React, { useState } from 'react';

const PanContext = React.createContext();

const PanProvider = ({children}) => {
    const [panDistance, setPanDistance] = useState(0);
    const [panReleased, setPanReleased] = useState(false);
    const [scroll, setScroll] = useState(0);

    return (
        <PanContext.Provider value={{
            panDistance, setPanDistance, panReleased, setPanReleased, scroll, setScroll,
        }}>
            {children}
        </PanContext.Provider>
    );
};

const usePanAnimation = () => {
    return React.useContext(PanContext);
};

export { PanContext, PanProvider, usePanAnimation };
