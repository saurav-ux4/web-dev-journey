import { useContext,useEffect,useRef } from "react";
import { SocketContext } from "../context/SocketContext";

function ChatBox({ messages, user }) {

  const { typingUser } = useContext(SocketContext);
  const bottomRef = useRef(null);


  useEffect(() => {

  bottomRef.current?.scrollIntoView({
    behavior: "smooth"
  });

}, [messages]);


  return (

    <div
      style={{
        flex: 1,
        padding: "10px",
        overflowY:"auto"
        
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

      <div ref={bottomRef}></div>

    </div>

  );

}

export default ChatBox;