import axios from 'axios';
import LOGIN_USER from './type'
const loginUser=async (data)=>{
    const response =await axios.post('/api/user/login',data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return {
        type:LOGIN_USER,
        payload:{loginStatus:response.data.loginSuccess}
    }
}
export default loginUser