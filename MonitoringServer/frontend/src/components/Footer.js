import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-4 text-center">
            <p>&copy; {new Date().getFullYear()} Employee Management</p>
        </footer>
    );
}

export default Footer;
