import React from 'react';

const DracoriaNavbar: React.FC = () => {
    // Function to toggle visibility of cards by ID
    const toggleCard = (cardId: string) => {
        const card = document.getElementById(cardId);
        card?.classList.toggle('hidden');
    };

    return (
        <nav color='primary'>
            <div className='navbar-menu'>
                <div className='navbar-item'>
                    Dragon Stats
                </div>
                <div className='navbar-item'>
                    Garden Stats
                </div>
                <div className='navbar-item'>
                    Settings
                </div>
                <div className='navbar-item'>
                    Chat
                </div>
            </div>
        </nav>
    );
};

export default DracoriaNavbar;
