
function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <article
      className={`chat-message-row ${
        isUser ? "user-row" : "assistant-row"
      }`}
    >
      <div className="message-avatar">
        {isUser ? "You" : "✦"}
      </div>

      <div className="message-body">
        <strong>
          {isUser ? "You" : "HR Assistant"}
        </strong>

        <p>{message.content}</p>
      </div>
    </article>
  );
}

export default ChatMessage;

