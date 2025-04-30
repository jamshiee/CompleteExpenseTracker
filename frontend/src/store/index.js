import {create} from 'zustand'

const useStore = create((set)=>({
    user: JSON.parse(localStorage.getItem("user")) ?? null,
    isOpen: false,
    accData : [],

    setAccData:(data)=> set({accData: data}),
    setIsOpen:(value) => set({isOpen: value}),
    setCredentials:(user)=> set({user}),
    signOut:()=>set({user:null}),

}))

export default useStore