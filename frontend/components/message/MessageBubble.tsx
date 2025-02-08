"use client";

interface MessageBubbleProps {
    content: string;
    sender: 'user' | 'bot';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, sender }) => {
    const isUser = sender === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className="flex flex-col items-start">
                <span className={`text-lg text-gray-500 mb-2 ${isUser ? 'mr-1 self-end' : 'ml-1 self-start'}`}>{isUser ? 'You' : 'Bot'}</span>
                <div className={`p-2 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} max-w-xl break-words`}>
                    {content}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;