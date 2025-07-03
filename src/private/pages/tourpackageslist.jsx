import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TourCards from '../components/TourCard';
import Navbar from '../components/NavBar';

const TourPackageslist = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axios.get(`/api/packages/find`);
                setDestinations(response.data);
            } catch (error) {
                console.error('Error fetching tour packages:', error);
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
            <Navbar/>
            <div className='p-4'>
            <TourCards 
                section="TourPackages" 
                destinations={destinations} 
            />
            </div>
        </div>
    );
};

export default TourPackageslist;
