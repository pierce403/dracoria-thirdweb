import React from 'react';

const Navbar: React.FC = () => {
    // Function to toggle visibility of cards by ID
    const toggleCard = (cardId: string) => {
        const card = document.getElementById(cardId);
        card?.classList.toggle('hidden');
    };

    return (
        <nav className="navbar">
            <div className="navbar-items">
                {/* Buttons to toggle different stats cards */}
                <button>Dragon Stats</button>
                <button>Garden Stats</button>
                <button>Settings</button>
                <button>Chat</button>
            </div>
        </nav>
    );
};

export default Navbar;
