import { useContext,useEffect,useState } from "react";

import { AuthContext } from "../context/AuthContext";

import API from "../services/api";

import Sidebar from "../components/Sidebar";

import ChatBox from "../components/ChatBox";

import MessageInput from "../components/MessageInput";

function Home() {
 const { user } = useContext(AuthContext);

 const [groups, setGroups] = useState([]);

  const [groupName, setGroupName] = useState("");

  const [messages, setMessages] = useState([]);

   const [selectedGroup, setSelectedGroup] = useState(null);


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



  // SEND MESSAGE
  const sendMessage = async (content) => {

    try {

      const res = await API.post(

        "/messages",

        {
          groupId: selectedGroup._id,
          content
        },

        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

      );

      setMessages([...messages, res.data]);

    } catch (error) {

      console.log(error);

    }

  };



useEffect(() => {
  if (!selectedGroup) return;

  const loadMessages = async () => {
    try {
      const res = await API.get(`/messages/${selectedGroup._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  loadMessages();
}, [selectedGroup,user]);

 return (

    <div 
        style={{
        display: "flex",
        height: "100vh"
      }}
    >


    <Sidebar
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />


       <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >


         <div
          style={{
            padding: "10px",
            borderBottom: "1px solid gray"
          }}
        >

             <h2>
            {selectedGroup
              ? selectedGroup.name
              : "Select Group"}
          </h2>

          </div>


          <ChatBox 
          messages={messages}
          user={user}
          />



            {

          selectedGroup && (

            <MessageInput
              sendMessage={sendMessage}
            />

          )

        }

        <div
          style={{
            padding: "10px"
          }}
        >

          <input
            type="text"
            placeholder="New Group"
            value={groupName}
            onChange={(e) =>
              setGroupName(e.target.value)
            }
          />

           <button onClick={createGroup}>
            Create Group
          </button>

          </div>
          
        </div>

      </div>

    
  );
}




export default Home;