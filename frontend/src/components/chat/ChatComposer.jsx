function ChatComposer({
  value,
  onChange,
  onSubmit,
  sendingMessage = false,
}) {
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="chat-composer-area">
      <form
        className="chat-composer"
        onSubmit={onSubmit}
      >
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask anything about HR policies..."
          aria-label="Your HR question"
          rows={1}
          disabled={sendingMessage}
          onKeyDown={handleKeyDown}
        />

        <button
          type="submit"
          className="chat-send-button"
          disabled={!value.trim() || sendingMessage}
          aria-label="Send message"
          title="Send message"
        >
          {sendingMessage ? "…" : "↑"}
        </button>
      </form>

      <p className="composer-disclaimer">
        Answers are based on your company's HR policy documents.
      </p>
    </div>
  );
}

export default ChatComposer;