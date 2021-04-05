import React, { createContext } from 'react';
export const userContext = createContext();
const DataContext = () => {
    return (
        <userContext.provider>

        </userContext.provider>
    );
};

export default DataContext;