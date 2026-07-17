import { createContext } from "react";

export const ThemeContext= createContext();


export function ThemeProvider({children}) {

    const theme= "light";
    return (
       <ThemeContext.Provider value={theme}>
{children}

       </ThemeContext.Provider>
    )
}