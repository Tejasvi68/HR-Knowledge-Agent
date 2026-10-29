import apiRequest from "./api";

export async function registerUser(userData) {
const data = await apiRequest("/api/auth/register", {
method: "POST",
body: JSON.stringify(userData),
});

if (!data?.access_token || !data?.user) {
throw new Error("Invalid registration response from server.");
}

localStorage.setItem("access_token", data.access_token);

return data;
}

export async function loginUser(credentials) {
const data = await apiRequest("/api/auth/login", {
method: "POST",
body: JSON.stringify(credentials),
});

if (!data?.access_token || !data?.user) {
throw new Error("Invalid login response from server.");
}

localStorage.setItem("access_token", data.access_token);

return data;
}

export async function getCurrentUser() {
return apiRequest("/api/auth/me");
}

export function logoutUser() {
localStorage.removeItem("access_token");
}
