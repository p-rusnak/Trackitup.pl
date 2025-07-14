const config = {
    apiDefaultURL: process.env.REACT_APP_API_URL,
    apiTimeout: 35000 || process.env.REACT_APP_API_TIMEOUT,
    appDefaultURL: process.env.REACT_APP_PUBLIC_URL,
    env: process.env.NODE_ENV,
}

export default config