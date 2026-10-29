import {
createContext,
useContext,
useEffect,
useState,
} from "react";

import {
getCurrentUser,
loginUser,
logoutUser,
registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
let mounted = true;


async function loadUser() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    if (mounted) {
      setUser(null);
      setLoading(false);
    }
    return;
  }

  try {
    const currentUser = await getCurrentUser();

    if (mounted) {
      setUser(currentUser);
    }
  } catch (error) {
    logoutUser();

    if (mounted) {
      setUser(null);
    }
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
}

loadUser();

return () => {
  mounted = false;
};


}, []);

useEffect(() => {
function handleUnauthorized() {
logoutUser();
setUser(null);
}


window.addEventListener(
  "auth:unauthorized",
  handleUnauthorized
);

return () => {
  window.removeEventListener(
    "auth:unauthorized",
    handleUnauthorized
  );
};


}, []);

async function login(credentials) {
const data = await loginUser(credentials);
setUser(data.user);
return data;
}

async function register(userData) {
const data = await registerUser(userData);
setUser(data.user);
return data;
}

function logout() {
logoutUser();
setUser(null);
}

return (
<AuthContext.Provider
value={{
user,
loading,
isAuthenticated: Boolean(user),
login,
register,
logout,
}}
>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
const context = useContext(AuthContext);

if (!context) {
throw new Error(
"useAuth must be used inside AuthProvider."
);
}

return context;
}
