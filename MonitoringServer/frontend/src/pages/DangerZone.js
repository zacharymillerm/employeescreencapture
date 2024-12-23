import React, { useState } from 'react';
import { cleanOldData } from '../api/api';

const DangerZone = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRemoveOldData = async () => {
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await cleanOldData();
            if (response.data.success) {
                setSuccessMessage('Old data removed successfully!');
            } else {
                setErrorMessage('Failed to remove old data.');
            }
        } catch (err) {
            setErrorMessage('An error occurred while removing old data.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Danger Zone</h1>
            <button
                onClick={handleRemoveOldData}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
                Remove data older than 2 weeks
            </button>
            {successMessage && (
                <p className="text-green-500 mt-4">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
        </div>
    );
};

export default DangerZone;
