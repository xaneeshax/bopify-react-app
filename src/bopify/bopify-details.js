import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from "react-router";
import {useDispatch} from 'react-redux';
import {createSongsThunk} from "../songs/songs-thunks";

const BopifySearch = () => {
    const [song, setSong] = useState(null);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const dispatch = useDispatch();
    const {pathname} = useLocation()
    const parts = pathname.split('/')
    const accessToken = parts[2];
    const songID = parts[3];

    console.log(accessToken);
    console.log(songID);

    useEffect(() => {

        const searchParams = {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + accessToken
            }
        }

        fetch('https://api.spotify.com/v1/tracks/' + songID, searchParams)
            .then(response => response.json())
            .then(data => {
                console.log('song data');
                console.log(data);
                setSong(data);
            })

    }, [])

    function addSong() {
        setArtist(song.artists[0].name);
        setTitle(song.name); 
        return dispatch(createSongsThunk({title, artist}));
    }

    return (
        <>
            <h1>Bopify Details</h1>
            { song &&
            <div>
                <h3>{song.name}</h3>
                <h5>{'By: ' + song.artists[0].name}</h5>
                <button onClick={addSong()} className='btn btn-primary'>Add Song</button>
            </div>}
        </>
    )
}

export default BopifySearch;