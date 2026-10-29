import { useMemo, useState } from "react";
import "./sidebar.css";
import {
LayoutDashboard,
MessageCircle,
MessagesSquare,
FileText,
Settings,
HelpCircle,
Plus,
Menu,
X,
LogOut,
UserRound,
ChevronDown,
Trash2,
Search,
} from "lucide-react";


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

async function handleDeleteChat(event, chat) {
event.stopPropagation();


const confirmed = window.confirm(
  `Delete "${chat.title || "New Chat"}"? This action cannot be undone.`
);

if (!confirmed) {
  return;
}

await onDeleteChat(chat.id);


}

return ( <section className="sidebar-chat-history" aria-label="Recent chats"> <div className="history-heading"> <span>RECENT CHATS</span>


    <button
      type="button"
      aria-label="Create new chat"
      title="New chat"
      onClick={onNewChat}
    >
      <Plus size={17} />
    </button>
  </div>

  <div className="sidebar-search">
    <Search size={15} />

    <input
      type="search"
      placeholder="Search chats..."
      aria-label="Search previous chats"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  </div>

  {filteredChats.length === 0 ? (
    <p className="empty-chat-history">
      {search.trim()
        ? "No matching chats found."
        : "No conversations yet. Create a new chat to get started."}
    </p>
  ) : (
    <div className="history-chat-list">
      {filteredChats.map((chat) => (
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
            <MessagesSquare size={16} />

            <span>{chat.title || "New Chat"}</span>
          </button>

          <button
            type="button"
            className="history-delete-button"
            aria-label={`Delete ${chat.title || "chat"}`}
            title="Delete conversation"
            onClick={(event) => handleDeleteChat(event, chat)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  )}
</section>


);
}

function Sidebar({
user,
chats = [],
activePage = "Dashboard",
activeChatId = null,
onNavigate = () => {},
onNewChat = () => {},
onOpenChat = () => {},
onDeleteChat = () => {},
onLogout = () => {},
}) {
const [mobileOpen, setMobileOpen] = useState(false);
const [profileOpen, setProfileOpen] = useState(false);

const navigation = [
{ label: "Dashboard", icon: LayoutDashboard },
{ label: "Ask HR", icon: MessageCircle },
{ label: "Settings", icon: Settings },
{ label: "Help", icon: HelpCircle },
];

const displayName = user?.name || user?.full_name || "User";
const email = user?.email || "";

const initials = displayName
.trim()
.split(/\s+/)
.filter(Boolean)
.slice(0, 2)
.map((part) => part[0])
.join("")
.toUpperCase();

function navigate(label) {
onNavigate(label);
setMobileOpen(false);
}

function handleNewChat() {
onNewChat();
setMobileOpen(false);
}

function handleOpenChat(chat) {
onOpenChat(chat);
setMobileOpen(false);
}

async function handleLogout() {
setProfileOpen(false);
setMobileOpen(false);
await onLogout();
}

return (
<>
<button
className="mobile-menu-button"
type="button"
aria-label="Open navigation menu"
aria-expanded={mobileOpen}
onClick={() => setMobileOpen(true)}
> <Menu size={21} /> </button>


  {mobileOpen && (
    <button
      className="sidebar-overlay"
      type="button"
      aria-label="Close navigation menu"
      onClick={() => setMobileOpen(false)}
    />
  )}

  <aside
    className={`app-sidebar ${mobileOpen ? "sidebar-open" : ""}`}
    aria-label="Application sidebar"
  >
    <div className="sidebar-brand">
      <div className="brand-icon">
        <FileText size={19} />
      </div>

      <span>HR Knowledge Agent</span>

      <button
        className="sidebar-close-button"
        type="button"
        aria-label="Close navigation"
        onClick={() => setMobileOpen(false)}
      >
        <X size={20} />
      </button>
    </div>

    <nav className="sidebar-navigation" aria-label="Main navigation">
      {navigation.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className={`sidebar-nav-item ${
            activePage === label ? "active" : ""
          }`}
          aria-current={activePage === label ? "page" : undefined}
          onClick={() => navigate(label)}
        >
          <Icon size={17} />
          <span>{label}</span>
        </button>
      ))}
    </nav>

    <ChatHistory
      chats={chats}
      activeChatId={activeChatId}
      onNewChat={handleNewChat}
      onOpenChat={handleOpenChat}
      onDeleteChat={onDeleteChat}
    />

    <div className="sidebar-profile">
      {profileOpen && (
        <div className="profile-menu">
          <div className="profile-menu-user">
            <strong>{displayName}</strong>
            <span>{email}</span>
          </div>

          <button type="button" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}

      <button
        type="button"
        className="profile-trigger"
        onClick={() => setProfileOpen((open) => !open)}
        aria-expanded={profileOpen}
      >
        <div className="profile-avatar">
          {initials || <UserRound size={18} />}
        </div>

        <div className="profile-details">
          <strong>{displayName}</strong>
          <span>{email || "Signed-in user"}</span>
        </div>

        <ChevronDown
          size={17}
          className={`profile-chevron ${
            profileOpen ? "profile-chevron-open" : ""
          }`}
        />
      </button>
    </div>
  </aside>
</>


);
}

export default Sidebar;
