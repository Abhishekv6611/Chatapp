import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import {io}from "socket.io-client"


const BASE_URL=import.meta.env.MODE === "development"?"http://localhost:5001":"/"


export const useAuthStore=create((set, get)=>({
   
    authUser:null,
    isSignUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
    
    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get('/auth/check')
            set({authUser:res.data})
            get().connectSocket()

        } catch (error) {
            console.log(error);
            
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

       signup:async(data)=>{
        set({isSignUp:true})
        try {
        const res=   await axiosInstance.post("/auth/signup",data)
        set({authUser:res.data})
       toast.success("Account Created successfully")
       get().connectSocket()

    } catch (error) {
        toast.error(error.response.data.message)
            console.log(error);  
        }finally{
            set({isSignUp:false})
        }

},

logout:async()=>{
    try {
        await axiosInstance.post("/auth/logout")
        set({authUser:null})
        toast.success("Logged out Successfully")
        get().disconnectSocket()
    } catch (error) {
        toast.error(error.response.data.messag)
    }
},

login:async(data)=>{
    set({isLoggingIng:true})
    try {
        const res=await axiosInstance.post("/auth/login",data)
        set({authUser:res.data})
        toast.success("Logging in Successfully")
        get().connectSocket()
    } catch (error) {
        toast.error(error.response.data.message)
    }finally{
        set({isLoggingIng:false})
    }
},

updateProfile:async(data)=>{
    set({isUpdatingProfile:true})
    try {
        const res=await axiosInstance.put("/auth/update-profile",data)
        set({authUser:res.data})
        toast.success("Profile Updated Successfully")
    } catch (error){
        console.log("error in update profile: ",error)
        toast.error(error.response.data.message)
    }finally{
        set({isUpdatingProfile:false})
    }
},

connectSocket:()=>{
    const {authUser}=get()
    if(!authUser || get().socket?.connected)return

    const socket=io(BASE_URL,{
        query:{

            userId:authUser._id
        },
    })
    socket.connect()
    set({socket:socket})
    socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers:userIds})
    })
},
disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconect()
}


}))
