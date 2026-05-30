import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

function ChatBox({ messages, user }) {

  const { typingUser } = useContext(SocketContext);

  return (

    <div
      style={{
        flex: 1,
        padding: "10px",
        
      }}
    >

     

     {
    typingUser && (
         <div
                style={{
                         marginBottom: "10px",
                         fontStyle: "italic"
                       }}
                  >
                    {typingUser} is typing...
         </div>
  )
}

      

      {

        messages.map((msg) => (

          <div key={msg._id}>

            <strong>

              {
                msg.sender._id === user._id
                  ? "You"
                  : msg.sender.name
              }

              :

            </strong>

            {" "}

            {msg.content}

          </div>

        ))

      }

    </div>

  );

}

export default ChatBox;