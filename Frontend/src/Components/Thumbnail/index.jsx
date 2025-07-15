import React from 'react'
import styled from 'styled-components'
import ChatIcon from '@mui/icons-material/Chat';
import { Divider, Icon } from '@mui/material';
import { styled as styledMui } from '@mui/system';
import { useNavigate } from 'react-router';
import grades from '../../Assets/Grades';

const TAG_COLORS = {
    drill: 'red',
    gimmick: 'yellow',
    twist: 'green',
    jack: '#add8e6',
    'jack/jump': '#add8e6',
    bracket: 'blue',
    half: 'black',
    side: 'black'
}


const Thumbnail = ({data, onClick}) => {
    const navigate = useNavigate()
    const diffData = data.diffs?.find(
        (d) => d.diff === data.diff && d.type === data.mode
    )
    const tcolors = (diffData?.tag || []).filter(t => TAG_COLORS[t])
    let tagStyle = {}
    if (tcolors.length === 1) {
        tagStyle.background = TAG_COLORS[tcolors[0]]
    } else if (tcolors.length >= 2) {
        tagStyle.background = `linear-gradient(90deg, ${TAG_COLORS[tcolors[0]]} 50%, ${TAG_COLORS[tcolors[1]]} 50%)`
    }

    return (
        <Container
            onClick={onClick}
        >
            <Image>
                {tcolors.length > 0 && <TagIndicator style={tagStyle} />}
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
    @media only screen and (max-width: 600px) {
        min-width: calc(50% - 10px);
        max-width: calc(50% - 10px);
    }
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

const TagIndicator = styled.div`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 2;
`