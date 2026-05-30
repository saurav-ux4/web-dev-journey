
import { useContext,useEffect,useState } from "react";

import { AuthContext } from "../context/AuthContext";

import API from "../services/api";

import Sidebar from "../components/Sidebar";

import ChatBox from "../components/ChatBox";

import MessageInput from "../components/MessageInput";

import { SocketContext } from "../context/SocketContext";

function Home() {
  const {
          socket,
          onlineUsers
         } = useContext(SocketContext);

  const { user } = useContext(AuthContext);

  const [groups, setGroups] = useState([]);

  const [groupName, setGroupName] = useState("");

  const [memberEmail, setMemberEmail] = useState("");

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


  // ADD MEMBER
const addMember = async () => {

  try {

    await API.put(

      "/groups/add-member",

      {
        groupId: selectedGroup._id,
        email: memberEmail
      },

      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

    );

    alert("Member Added");

    setMemberEmail("");

  } catch (error) {

    console.log(error);

    alert(error.response.data.message);

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
    
       socket.emit(
       "send_message",
        res.data
        );

    } catch (error) {

      console.log(error);

    }

  };



useEffect(() => {

  if (!selectedGroup) return;

    socket.emit(
     "join_group",
     selectedGroup._id
  );

  const loadMessages = async () => {

    try {

      const res = await API.get(

        `/messages/${selectedGroup._id}`,

        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

      );

      setMessages(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  loadMessages();

}, [selectedGroup, user, socket]);




useEffect(() => {

  socket.on(

    "receive_message",

    (message) => {

         console.log("RECEIVED MESSAGE:", message);

      setMessages((prev) => [

        ...prev,
        message

      ]);

    }

  );

  return () => {

    socket.off("receive_message");

  };

}, [socket]);


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

            
         <div>

  <h2>
    {selectedGroup
      ? selectedGroup.name
      : "Select Group"}
  </h2>

  {

    selectedGroup?.members?.map((memberId) => (

      <div key={memberId}>

        {

          onlineUsers.includes(memberId)

            ? "🟢 Online"

            : "⚫ Offline"

        }

      </div>

    ))

  }

</div>



          </div>


          <div
  style={{
    background: "yellow"
  }}
>
  CHATBOX START
</div>

<ChatBox
  messages={messages}
  user={user}
/>



            {

          selectedGroup && (

            <MessageInput
              sendMessage={sendMessage}
              groupId={selectedGroup._id}
              userName={user.name}
            />

          )

        }


        {

  selectedGroup && (

    <div
      style={{
        padding: "10px"
      }}
    >

      <input
        type="email"
        placeholder="Add member by email"
        value={memberEmail}
        onChange={(e) =>
          setMemberEmail(e.target.value)
        }
      />

      <button onClick={addMember}>
        Add Member
      </button>

    </div>

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