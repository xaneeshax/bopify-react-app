import {useEffect, useState} from "react";
import {Container, Card, Row} from 'react-bootstrap';
import Login from './Login.js';
import {Link} from "react-router-dom";
import './index.css';

const BopifySearch = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [accessToken, setAccessToken] = useState('');
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const queryString = window.location.hash;

        if (queryString) {
            const queryList = queryString.replace('#', '').split('&');
            let accessString = queryList[0];
            accessString = accessString.split('=')[1];
            setAccessToken(accessString);
        }
    }, [])

    async function search() {
        console.log('Search for ' + searchTerm);

        const searchParams = {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + accessToken
            }
        }

        await fetch('https://api.spotify.com/v1/search?type=track&q=artist:' + searchTerm, searchParams)
            .then(response => response.json())
            .then(data => {
                setSongs(data.tracks.items);
            })

    }
    console.log(songs);
    return (
        <>
            <h1>Bopify Search</h1>
            <Login/>
            <ul className="list-group mb-2">
                <li className="list-group-item">
                    <button
                        className="btn btn-primary float-end"
                        onClick={() => {
                            search();
                        }}>Search
                    </button>
                    <input
                        className="form-control w-75"
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                        }}
                        value={searchTerm}/>
                </li>
            </ul>
            <Container>
                <Row className=" row row-cols-4">
                    {songs.map((song) => {
                            return (
                                <Card className="p-0">
                                    <Card.Img src={song.album.images[0].url} />
                                    <Card.Body>
                                        <Card.Title className="song-name">
                                            {song.name}
                                        </Card.Title>
                                        <Link to={`/details/${accessToken}/${song.id}`}><button className="btn btn-primary details-button">Details</button></Link>
                                    </Card.Body>
                                </Card>
                            )
                        }
                    )}
                </Row>
            </Container>
        </>
    )
}

export default BopifySearch