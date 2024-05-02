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
        <div className="chatCard card">
            <h3>Chat with Your Dragon</h3>
            <div className="conversationHistory" style={{ height: '200px', overflowY: 'scroll', backgroundColor: '#f2f2f2', padding: '10px', marginBottom: '10px' }}>
                {conversation.map((msg, index) => (<div key={index}>{msg}</div>))}
            </div>
            <input type="text" value={message} placeholder="Say something to your dragon..." style={{ width: '70%', marginRight: '10px' }} />
            <button>Send</button>
        </div>
    );
}

export default Chat;
