
import { useMemo, useState } from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

function ChatHistory({
  chats = [],
  activeChatId = null,
  onNewChat = () => {},
  onOpenChat = () => {},
  onDeleteChat = () => {},
}) {
  const [search, setSearch] = useState("");

  const filteredChats = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return chats;
    }

    return chats.filter((chat) =>
      (chat.title || "New Chat").toLowerCase().includes(searchTerm)
    );
  }, [chats, search]);

  async function handleDelete(event, chat) {
    event.stopPropagation();

    const confirmed = window.confirm(
      `Delete "${chat.title || "New Chat"}"? This cannot be undone.`
    );

    if (confirmed) {
      await onDeleteChat(chat.id);
    }
  }

  return (
    <section className="sidebar-chat-history">
      <div className="history-heading">
        <span>CHAT HISTORY</span>

        <button
          type="button"
          aria-label="Create new chat"
          title="New chat"
          onClick={onNewChat}
        >
          <Plus size={17} />
        </button>
      </div>

      {chats.length > 0 && (
        <div className="history-search">
          <input
            type="search"
            placeholder="Search chats..."
            aria-label="Search chat history"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      )}

      <div className="history-chat-list">
        {filteredChats.length === 0 ? (
          <p className="empty-chat-history">
            {search.trim()
              ? "No matching chats found."
              : "Your previous chats will appear here."}
          </p>
        ) : (
          filteredChats.map((chat) => (
            <div
              className={`history-chat-row ${
                activeChatId === chat.id ? "selected" : ""
              }`}
              key={chat.id}
            >
              <button
                type="button"
                className="history-chat-item"
                onClick={() => onOpenChat(chat)}
                title={chat.title || "New Chat"}
              >
                <MessageSquare size={16} />

                <span>{chat.title || "New Chat"}</span>
              </button>

              <button
                type="button"
                className="history-delete-button"
                aria-label={`Delete ${chat.title || "chat"}`}
                title="Delete chat"
                onClick={(event) => handleDelete(event, chat)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default ChatHistory;

