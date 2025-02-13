import React from 'react';

function Navbar() {
    return (
        <nav>
            <h1>Climate Lens</h1>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/data-explorer">Data Explorer</a></li>
                <li><a href="/climate-atlas">Climate Atlas</a></li>
                <li><a href="/future-lens">Future Lens</a></li>
                <li><a href="/eco-actions">Eco Actions</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
