import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Card from './Card'; 
import '../styles/Dashboard.css';

const url = process.env.REACT_APP_PUBLIC_URL;

const Dashboard = ({isLoggedOut, apiURL}) => {
    const { username } = useParams();
    const [pokemonData, setPokemonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);
    const navigate = useNavigate();

    //console.log(url) //debugging env variable

    // It makes sure that we only the url data when url changes
    useEffect(() => {

        const fetchPokemonData = async (url) => {
            try {
                const response = await axios.get(url);
                setPokemonData(response.data.results);
                //console.log(pokemonData);
                setNextUrl(response.data.next);
                setPrevUrl(response.data.previous);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        //`${apiUrl}?limit=${limit}&offset=${(currentPage - 1) * limit}`);
        //https://pokeapi.co/api/v2/pokemon?limit=20&offset=0
        if (url) {
            fetchPokemonData(url);
        } else {
            setError(new Error('API URL is not defined'));
            setLoading(false);
        }
        //fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
    }, []);

    // set PokemonData to next data
    const handleNext = () => {
        if (nextUrl) {
            setLoading(true);
            fetchPokemonData(nextUrl);
        }
    };

    // set PokemonData to previous data
    const handlePrevious = () => {
        if (prevUrl) {
            setLoading(true);
            fetchPokemonData(prevUrl);
        }
    };

    const handleLogout = () => {
        isLoggedOut();
        navigate('/login');
    };

    // Fuction to get next 20 or prev 20 pokimon url data
    const fetchPokemonData = async (url) => {
        try {
            const response = await axios.get(url);
            setPokemonData(response.data.results);
            setNextUrl(response.data.next);
            setPrevUrl(response.data.previous);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) 
    return (
        <p>Error fetching data: {error.message}</p>
    )

    return (
        <div className="dashboard">
            {/*Navbar */}
            <nav className="navbar">
                <div className="navbar-content">
                    <span className="welcome-message">Welcome, {username}</span>
                    <button className="logout-button" onClick={handleLogout}>Logout</button> {/*Logout button */}
                </div>
            </nav>
            <h1>Pokémon Dashboard</h1>
            {/*Loads pokemon data */}
            <div className="pokemon-list">
                {pokemonData.map(pokemon => (
                    <Card
                        key={pokemon.name}
                        username = {username}
                        name={pokemon.name}
                        url = {pokemon.url}
                        //height={pokemon.height} 
                        //weight={pokemon.weight} 
                    />
                ))}
            </div>
            {/* Next and previous button*/}
            <div className="pagination-buttons">
                <button
                    className="pagination-button"
                    onClick={handlePrevious}
                    disabled={!prevUrl}
                >
                    Previous
                </button>
                <button
                    className="pagination-button"
                    onClick={handleNext}
                    disabled={!nextUrl}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Dashboard;