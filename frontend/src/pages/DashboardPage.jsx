import ChatComposer from "../components/chat/ChatComposer";
import "../components/chat/chat.css";
import "../components/dashboard/dashboard.css";
function DashboardPage({
  draftMessage,
  setDraftMessage,
  handleSendMessage,
  sendingMessage,
}) {
  const suggestions = [
    {
      icon: "📅",
      title: "Leave policy",
      description: "Understand leave and attendance rules",
      question: "What is the company's leave policy?",
    },
    {
      icon: "🕒",
      title: "Attendance",
      description: "Learn about working hours and attendance",
      question: "What is the company's attendance policy?",
    },
    {
      icon: "💼",
      title: "Payroll & benefits",
      description: "Explore salary and benefits policies",
      question: "What are the company's payroll policies?",
    },
    {
      icon: "🏢",
      title: "Workplace policies",
      description: "Explore workplace rules and guidelines",
      question: "What is the company's work-from-home policy?",
    },
  ];

  return (
    <section className="chat-workspace">
      <div className="chat-conversation">
        <div className="chat-welcome">
          <div className="chat-welcome-icon">✦</div>

          <h2>How can I help you today?</h2>

          <p>
            Ask me about company policies, leave, attendance,
            payroll, or workplace guidelines.
          </p>

          <div className="suggestion-grid">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion.title}
                onClick={() =>
                  setDraftMessage(suggestion.question)
                }
              >
                <span className="suggestion-icon">
                  {suggestion.icon}
                </span>

                <strong>{suggestion.title}</strong>

                <span>{suggestion.description}</span>
              </button>
            ))}
          </div>
        </div>
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

export default DashboardPage;