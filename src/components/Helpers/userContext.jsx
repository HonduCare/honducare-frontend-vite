import { createContext } from "react";
const initialState = {
    currentUser: {},
    setCurrentUser: null
}
export const userContext = createContext(initialState);