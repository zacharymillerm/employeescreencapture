import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-gray-800 text-white">
            <div className="flex justify-end">
                <Link
                    to="/"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                    Dashboard
                </Link>
                <Link
                    to="/dangerzone"
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                    DangerZone
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
