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
    getLatestScores = (limit) => client.get('scores/latest', { params: { limit } })

    getUsers = () => client.get('users')
    getLeaderboard = (mode) => client.get(`leaderboard/${mode}`)
}

export default client