import React from 'react'
import styled from 'styled-components'
import ChatIcon from '@mui/icons-material/Chat';
import { Divider, Icon } from '@mui/material';
import { styled as styledMui } from '@mui/system';
import { useNavigate } from 'react-router';
import grades from '../../Assets/Grades';


const Thumbnail = ({data, onClick}) => {
    const navigate = useNavigate()

    return (
        <Container
            onClick={onClick} 
        >
            <Image>
                <MainImg src={data.img} />
                {data.grade && <Score src={grades[data.grade]}/>}
                <Short>{data.bpm}</Short>
            </Image>
            
        </Container>
    )
}

export default Thumbnail

const Container = styled.div`
    display: flex;
    flex-direction: column; 
    justify-content: space-between;
    margin: 5px;
    background-color: white;
    min-width: 180px;
    min-height: 101px;
    max-width: 180px;
    max-height: 101px;
`
const Image = styled.div`
    display: flex;
    position: relative;
    height: 100%;
`
const MainImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`
const Score = styled.img`
    width: 70px;
    height: 70px;
    right: 0;
    position: absolute;
`
const Short = styled.div`
    right: 0;
    bottom: 0;
    background: lightgray;
    font-size: 18px;
    position: absolute;
    
`
const Details = styled.div`
    padding: 5px;
    display: flex;
    justify-content: space-between;
`
const Title = styled.div`
    font-weight: 500;
    margin-bottom: 5px;
`