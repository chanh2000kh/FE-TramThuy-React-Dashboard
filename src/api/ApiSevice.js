import axios from 'axios';

// const API_URL="http://localhost:5000";
const API_URL="https://be-tramthuy-nodejs.herokuapp.com";

export default function callApi(endpoint, method,body){
    return axios({
        method,
        url:`${API_URL}/${endpoint}`,
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("accessToken")}` 
        },
        data:body,
    })
    // .catch(e=>{
    //     console.log(e)
    // })
}