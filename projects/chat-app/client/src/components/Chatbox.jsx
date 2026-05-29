function ChatBox({ messages, user }) {

  return (

    <div
      style={{
        flex: 1,
        padding: "10px"
      }}
    >

      <h2>Messages</h2>

      {

        messages.map((msg) => (

          <div
            key={msg._id}
            style={{
              marginBottom: "10px"
            }}
          >

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