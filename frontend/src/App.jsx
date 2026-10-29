import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import "./styles/global.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";

import Sidebar from "./components/sidebar/Sidebar";

import { useAuth } from "./context/AuthContext";

import {
  getChats,
  createChat,
  getChatMessages,
  sendChatMessage,
  deleteChat,
} from "./services/chatService";


function ProtectedDashboard() {
  const { user, loading, logout } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  const [page, setPage] = useState("Dashboard");

  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const [error, setError] = useState("");
  const [draftMessage, setDraftMessage] = useState("");


  // Load chat history when the user is authenticated.
  const loadChats = useCallback(async () => {
    if (!user) return;

    setLoadingChats(true);

    try {
      const data = await getChats();
      setChats(data);
    } catch (err) {
      setError(
        err.message || "Unable to load conversations."
      );
    } finally {
      setLoadingChats(false);
    }
  }, [user]);


  useEffect(() => {
    if (user && !loading) {
      loadChats();
    }
  }, [user, loading, loadChats]);


  // Create a new conversation.
  const handleNewChat = async () => {
    setError("");

    try {
      const newChat = await createChat("New Chat");

      if (!newChat?.id) {
        throw new Error(
          "The server did not return the new chat."
        );
      }

      setChats((previousChats) => [
        newChat,
        ...previousChats.filter(
          (chat) => chat.id !== newChat.id
        ),
      ]);

      setActiveChatId(newChat.id);

      setActiveChat({
        chat: newChat,
        messages: [],
      });

      setDraftMessage("");
      setPage("Ask HR");
    } catch (err) {
      setError(
        err.message || "Unable to create a new chat."
      );
    }
  };


  // Open an existing conversation.
  const handleOpenChat = async (chat) => {
    setError("");
    setLoadingConversation(true);

    setActiveChatId(chat.id);
    setActiveChat(null);
    setDraftMessage("");
    setPage("Ask HR");

    try {
      const data = await getChatMessages(chat.id);

      setActiveChat(data);
    } catch (err) {
      setError(
        err.message || "Unable to open this conversation."
      );
    } finally {
      setLoadingConversation(false);
    }
  };


  // Send a question to the HR Knowledge Agent.
  const handleSendMessage = async (event) => {
    event.preventDefault();

    const question = draftMessage.trim();

    if (!question || sendingMessage) {
      return;
    }

    setError("");
    setSendingMessage(true);

    let chatId = activeChatId;

    try {
      // Create a conversation automatically if needed.
      if (!chatId) {
        const newChat = await createChat("New Chat");

        if (!newChat?.id) {
          throw new Error(
            "Unable to create a new chat."
          );
        }

        chatId = newChat.id;

        setActiveChatId(chatId);

        setActiveChat({
          chat: newChat,
          messages: [],
        });

        setChats((previousChats) => [
          newChat,
          ...previousChats.filter(
            (chat) => chat.id !== newChat.id
          ),
        ]);
      }

      // Clear the input after saving the question locally.
      setDraftMessage("");

      // Send the question to the backend.
      await sendChatMessage(chatId, question);

      // Fetch the saved conversation and its AI response.
      const updatedChat = await getChatMessages(chatId);

      setActiveChat(updatedChat);

      // Update the corresponding sidebar entry.
      if (updatedChat.chat) {
        setChats((previousChats) =>
          previousChats.map((chat) =>
            chat.id === chatId ? updatedChat.chat : chat
          )
        );
      }

      // Refresh history in case the backend updates chat titles.
      await loadChats();

      setPage("Ask HR");
    } catch (err) {
      setError(
        err.message ||
          "Unable to get an answer. Please try again."
      );
    } finally {
      setSendingMessage(false);
    }
  };


  // Delete a conversation.
  const handleDeleteChat = async (chatId) => {
    setError("");

    try {
      await deleteChat(chatId);

      setChats((previousChats) =>
        previousChats.filter(
          (chat) => chat.id !== chatId
        )
      );

      if (activeChatId === chatId) {
        setActiveChatId(null);
        setActiveChat(null);
        setDraftMessage("");
        setPage("Dashboard");
      }
    } catch (err) {
      setError(
        err.message || "Unable to delete this conversation."
      );
    }
  };


  // Navigate between sidebar pages.
  const handleNavigate = (label) => {
    setError("");
    setPage(label);

    if (label !== "Ask HR") {
      setActiveChatId(null);
      setActiveChat(null);
    }
  };


  if (loading) {
    return (
      <div className="app-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return (
    <div className="app-layout">

      <Sidebar
        user={user}
        chats={chats}
        activePage={page}
        activeChatId={activeChatId}
        onNavigate={handleNavigate}
        onNewChat={handleNewChat}
        onOpenChat={handleOpenChat}
        onDeleteChat={handleDeleteChat}
        onLogout={logout}
      />


      <main className="main-content">

        {/* Application error message */}
        {error && (
          <div className="app-error" role="alert">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}


        {/* Dashboard page */}
        {page === "Dashboard" && (
          <DashboardPage
            draftMessage={draftMessage}
            setDraftMessage={setDraftMessage}
            handleSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
          />
        )}


        {/* Ask HR page */}
        {page === "Ask HR" && (
          <ChatPage
            activeChat={activeChat}
            loadingConversation={loadingConversation}
            draftMessage={draftMessage}
            setDraftMessage={setDraftMessage}
            handleSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
          />
        )}


        {/* Settings page */}
        {page === "Settings" && (
          <section className="simple-page">
            <h1>Settings</h1>

            <div className="settings-card">
              <p>
                <strong>Name</strong>
                <span>{user.name}</span>
              </p>

              <p>
                <strong>Email</strong>
                <span>{user.email}</span>
              </p>
            </div>
          </section>
        )}


        {/* Help page */}
        {page === "Help" && (
          <section className="simple-page">
            <h1>Help</h1>

            <p>
              Create a new chat and ask a question about
              company HR policies. Answers are generated
              using the indexed HR policy document.
            </p>
          </section>
        )}

      </main>
    </div>
  );
}


export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <RegisterPage />
          )
        }
      />

      <Route
        path="/"
        element={<ProtectedDashboard />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}