import { createContext, useContext, useState } from 'react'

const AppContext = createContext(undefined)

export function  AppContextProvider({children}){

    //Auth State
    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)

    return(
        <AppContext.Provider value={{
            user,
            setUser,
            loadingUser,
            setLoadingUser
        }}>
            {children}
        </AppContext.Provider>
    )
}

// Custom hook to use the AppContext
export function useAppContext(){
    const context = useContext(AppContext)
    if(context === undefined){
        throw new Error('useAppContext must be used within a AppContextProvider')
    }
    return context
}