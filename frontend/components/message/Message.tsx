interface MessageProps {
  content: string;
  sender: 'user' | 'bot';
}

const Message: React.FC<MessageProps> = ({ content, sender }) => {
  return (
      <div className={`message ${sender}`}>
          <span>{content}</span>
      </div>
  );
};

export default Message;