// src/app/Chat.tsx
/** @jsxImportSource react */
import React from 'react';

// Marking this component to run on the client
const Chat: React.FC = () => {

    let message = '';
    let conversation: string[] = [];

    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            const response = await fetch('/api/dragon/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            conversation = [...conversation, `You: ${message}`, `Dragon: ${data.reply.dragonMessage}`];
            message = '';  // Clear message input after sending
        } catch (error) {
            console.error('Error sending message to dragon:', error);
        }
    };

    return (
        <div className="box form">
            <h3 className="title">Chat with Your Dragon</h3>
            <div className="input m-2 p-6 textarea">
                {conversation.map((msg, index) => (<div key={index}>{msg}</div>))}
            </div>
            <div className='columns p-4'>
                <input type="text" defaultValue={message} placeholder="Say something to your dragon..." className="input" />
                <button className='button primary'>Send</button>
            </div>
        </div>
    );
}

export default Chat;
