import { createContext, useState, useEffect } from "react";
import jwtDecode from 'jwt-decode'

export const AuthContext = createContext(null)

export const AuthContextProvider = ({children}) => {
    const [user,setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")

        if(token)
        {
            const decoded = jwtDecode(token)
            if(decoded.exp * 1000 < Date.now())
            {
                localStorage.removeItem("token")
                setUser(null)
            }
            else
            {
                console.log("Userrrr",decoded)
                setUser(decoded)
            }
        }
    },[])

    const logout = () =>{
        localStorage.removeItem("token")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user,setUser,logout}}>
            {children}
        </AuthContext.Provider>
        
    )
}
