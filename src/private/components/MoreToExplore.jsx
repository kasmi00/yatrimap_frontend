import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TravelCards from '../components/TravelCards';

const MoreToExplore = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axios.get(`/api/destination/section/MoretoExplore`);
                setDestinations(response.data);
            } catch (error) {
                console.error('Error fetching destinations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <TravelCards 
                headline="More to Explore for your next vacation" 
                section="MoreToExplore" 
                destinations={destinations} 
            />
        </div>
    );
};

export default MoreToExplore;