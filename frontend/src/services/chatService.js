const API_URL = "http://127.0.0.1:8000/api/chats";

function getAuthHeaders() {
const token = localStorage.getItem("access_token");

if (!token) {
throw new Error("Your session has expired. Please log in again.");
}

return {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
};
}

async function handleResponse(response) {
const data = await response.json().catch(() => ({}));

if (!response.ok) {
throw new Error(
data.detail || `Request failed with status ${response.status}`
);
}

return data;
}

export async function getChats() {
const response = await fetch(API_URL, {
method: "GET",
headers: getAuthHeaders(),
});

const data = await handleResponse(response);
return data.chats || [];
}

export async function createChat(title = "New Chat") {
const response = await fetch(`${API_URL}/`, {
method: "POST",
headers: getAuthHeaders(),
body: JSON.stringify({ title }),
});

const data = await handleResponse(response);
return data.chat;
}

export async function getChatMessages(chatId) {
const response = await fetch(`${API_URL}/${chatId}`, {
method: "GET",
headers: getAuthHeaders(),
});

return handleResponse(response);
}

export async function sendChatMessage(chatId, message) {
const response = await fetch(`${API_URL}/${chatId}/messages`, {
method: "POST",
headers: getAuthHeaders(),
body: JSON.stringify({ message }),
});

return handleResponse(response);
}

export async function deleteChat(chatId) {
const response = await fetch(`${API_URL}/${chatId}`, {
method: "DELETE",
headers: getAuthHeaders(),
});

return handleResponse(response);
}
