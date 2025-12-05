import React, { createContext, useContext, useState } from 'react';
import { RouteOption } from '../services/routeService';

type RouteContextType = {
    selectedRoute: RouteOption | null;
    setSelectedRoute: (route: RouteOption | null) => void;
    destinationQuery: string;
    setDestinationQuery: (q: string) => void;
};

const RouteContext = createContext<RouteContextType>({
    selectedRoute: null,
    setSelectedRoute: () => { },
    destinationQuery: '',
    setDestinationQuery: () => { },
});

export const useRouteContext = () => useContext(RouteContext);

export const RouteProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
    const [destinationQuery, setDestinationQuery] = useState('');

    return (
        <RouteContext.Provider value={{ selectedRoute, setSelectedRoute, destinationQuery, setDestinationQuery }}>
            {children}
        </RouteContext.Provider>
    );
};
