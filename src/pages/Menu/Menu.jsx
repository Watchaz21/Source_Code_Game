import React, { useState, useEffect } from 'react';
import DeskTopMenu from './Desktop/DeskTopMenu'; // Ensure to import your DaskTopMenu component
import MobileMenu from './Mobile/MobileMenu';   // Ensure to import your MobileMenu component

const Menu = () => {
    const [isMobile, setIsMobile] = useState(null);

    useEffect(() => {
        const initializeGame = async () => {
            try {
                // Detect whether the device is a PC or mobile
                const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
                setIsMobile(isMobileDevice);

            } catch (error) {
                console.error('Error initializing the game:', error);
            }
        };

        initializeGame();
    }, []);

    return (
        <div className=''>
            {isMobile === null ? null : isMobile ? <MobileMenu /> : <DeskTopMenu />}
        </div>
    );
};

export default Menu;
