import React, { useState } from 'react';

const Settings: React.FC = () => {
    //const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');
    //const [notifications, setNotifications] = useState(false);

    // Function to handle settings form submission
    const updateSettings = async () => {

        let email = '';
        let password = '';
        let notifications = false;

        try {
            const response = await fetch('/api/updateSettings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, notifications }),
            });
            if (response.ok) {
                alert('Settings updated successfully!');
            } else {
                throw new Error('Failed to update settings');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="settingsCard card hidden">
            <h3>Settings</h3>
        </div>
    );
};

export default Settings;
