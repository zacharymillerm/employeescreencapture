import React from 'react';
import Navbar from './Navbar';

function Header() {
    return (
        <header className="relative bg-gray-800 text-white p-4">
            <h1 className="text-2xl absolute">Eagle Vision</h1>
            <Navbar></Navbar>
        </header>
    );
}

export default Header;
