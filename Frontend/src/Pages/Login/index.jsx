import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ApiClient } from '../../API/httpService'
import { useNavigate } from 'react-router-dom'

const apiClient = new ApiClient()

const Login = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState()
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault();
        apiClient.login({
            username,
            password,
        }).then(response => {
            localStorage.setItem('token', response.data.tokens.access.token);
            navigate(`/`)
            window.location.reload()
        }).catch(err => {
            setError(err)
        })
    }

    const handleRegister = (e) => {
        e.preventDefault();
        apiClient.register({
            username,
            email,
            password,
        }).then(response => {
            localStorage.setItem('token', response.data.tokens.access.token);
            navigate(`/`)
            window.location.reload()
        }).catch(err => {
            console.log(err)
        })
    }

    const validatePass2 = () => {
        let result = false

        if (password && password !== password2) {
            result = true
        }
        return result
    }

    const validatePass = () => {
        let result = false

        if (password && password.length < 8) result = true
        if (!password.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) result = true

        return result
    }

    return (
        <Container>
            <Box>
                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                    <Header>
                        {isLogin ? 'Log in' : 'Register'}
                    </Header>
                    {error && <>Niepoprawne dane lub brak konta</>}
                    <Text
                        id="outlined-username-input"
                        label="Nazwa użytkownika"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {!isLogin ? <Text
                        id="outlined-email-input"
                        label="Email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    /> : undefined}
                    <Text
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!isLogin && validatePass()}
                    />
                    {!isLogin && validatePass() && <p>Hasło musi być długie na 8 znaków w tym zawierać minimum 1 numer i cyfrę</p>}
                    {!isLogin && <><Text
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        error={!isLogin && (validatePass() || validatePass2())}
                    />
                        {!isLogin && validatePass2() && 'hasła nie są takie same'}
                        </>
                    }
                    <Buttons>
                        <Button type="submit" variant="contained" >{isLogin ? 'Zaloguj' : 'Załóż konto'}</Button>
                        <Button variant="contained" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Rejestracja' : 'Logowanie'}</Button>
                    </Buttons>
                </form>
            </Box>
        </Container>
    )
}

export default Login 

const Container = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Header = styled.h2`
    width: 100%;
`
const Buttons = styled.h2`
    display: flex;
    justify-content: space-between;
`
const Text = styled(TextField)`
    width: 100%;
    margin-top: 10px !important;
`

const Box = styled.div`
    border-radius: 10px;
    padding: 50px;
    width: 40%;
    @media only screen and (max-width: 600px) {
        width: 90%;
    }
    background-color: white;
    
`