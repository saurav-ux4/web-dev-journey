import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

function Home() {
 const { user } = useContext(AuthContext);

 return (

    <div>

      <h1>Home Page</h1>

      {user ? (

        <div>

          <h2>
            Welcome {user.name}
          </h2>

          <p>
            {user.email}
          </p>

        </div>

      ) : (

        <h2>
          Please Login
        </h2>

      )}

    </div>
  );
}




export default Home;