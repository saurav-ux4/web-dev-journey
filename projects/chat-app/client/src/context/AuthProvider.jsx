import { useState } from "react";

import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  const logout = () => {

    localStorage.removeItem("userInfo");

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;