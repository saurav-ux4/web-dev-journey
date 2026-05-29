import { useContext,useEffect,useState } from "react";

import { AuthContext } from "../context/AuthContext";

import API from "../services/api";

function Home() {
 const { user } = useContext(AuthContext);

 const [groups, setGroups] = useState([]);

  const [groupName, setGroupName] = useState("");


  // LOAD GROUPS
  useEffect(() => {
  const loadGroups = async () => {
    try {
      const res = await API.get("/groups", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setGroups(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  loadGroups();
}, [user]);

  // CREATE GROUP
  const createGroup = async () => {

    try {

      const res = await API.post(

        "/groups",

        {
          name: groupName
        },

        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

      );

      setGroups([...groups, res.data]);

      setGroupName("");

    } catch (error) {

      console.log(error);

    }

  };


 return (

    <div>

      <h1>welcome {user.name}</h1>

      <br />
       
       <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

     <button onClick={createGroup}>
        Create Group
      </button>

       <hr />

      <h2>Your Groups</h2>
 
  {

        groups.map((group) => (

          <div key={group._id}>

            <h3>
              {group.name}
            </h3>

          </div>

        ))

      }

    </div>
  );
}




export default Home;