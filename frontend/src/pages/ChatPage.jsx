import ChatComposer from "../components/chat/ChatComposer";
import ChatMessage from "../components/chat/ChatMessage";
import "../components/chat/chat.css";
function ChatPage({
  activeChat,
  loadingConversation,
  draftMessage,
  setDraftMessage,
  handleSendMessage,
  sendingMessage,
}) {
  return (
    <section className="chat-workspace">
      <header className="chat-topbar">
        <div>
          <h1>{activeChat?.chat?.title || "HR Assistant"}</h1>

          <p>
            HR Knowledge Agent · Company policy assistant
          </p>
        </div>

        <span className="chat-status">
          <span className="status-dot"></span>
          Ready to help
        </span>
      </header>

      
    <div className="chat-conversation">
        {loadingConversation ? (
            <div className="chat-loading">
            <span className="chat-spinner"></span>
            <p>Loading your conversation...</p>
            </div>
        ) : activeChat?.messages?.length > 0 ? (
            <div className="chat-message-list">
            {activeChat.messages.map((message) => (
                <ChatMessage
                key={message.id}
                message={message}
                />
            ))}

            {/* Show the thinking indicator while the AI responds */}
            {sendingMessage && (
                <article className="chat-message-row assistant-row">
                <div className="message-avatar">✦</div>

                <div className="message-body">
                    <strong>HR Assistant</strong>
                    <p className="thinking-indicator">
                       HR Assistant is thinking
                    <span className="thinking-dots" aria-hidden="true">
                        ...
                    </span>
                    </p>
                </div>
                </article>
            )}
            </div>
        ) : (
            <div className="chat-welcome">
            <div className="chat-welcome-icon">✦</div>

            <h2>What would you like to know?</h2>

            <p>
                Ask a question about your company's HR policies.
            </p>

            {sendingMessage && (
                <div className="chat-loading">
                <span className="chat-spinner"></span>
                <p>HR Assistant is thinking...</p>
                </div>
            )}
            </div>
        )}
        </div>



      <ChatComposer
        value={draftMessage}
        onChange={setDraftMessage}
        onSubmit={handleSendMessage}
        sendingMessage={sendingMessage}
      />
    </section>
  );
}

export default ChatPage;