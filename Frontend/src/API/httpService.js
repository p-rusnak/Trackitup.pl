import axios from 'axios'
import Config from '../config'

const client = axios.default.create({
    baseURL: Config.apiDefaultURL,
    timeout: Config.apiTimeout, 
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})

export class ApiClient {

    login = (params) => client.post('auth/login', params)
    register = (params) => client.post('auth/register', params)
    
    getScores = (mode) => client.get(`scores/${mode}`)
    postScores = (mode, data) => client.post(`scores/${mode}`, data)

    getUsers = () => client.get('users')
}

export default client