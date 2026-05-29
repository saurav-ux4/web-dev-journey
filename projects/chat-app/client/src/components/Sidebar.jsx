function Sidebar({

  groups,

  selectedGroup,

  setSelectedGroup

}) {

  return (

    <div
      style={{
        width: "30%",
        borderRight: "1px solid gray",
        padding: "10px"
      }}
    >

      <h2>Groups</h2>

      {

        groups.map((group) => (

          <div

            key={group._id}

            onClick={() => setSelectedGroup(group)}

            style={{
              padding: "10px",
              marginBottom: "5px",
              cursor: "pointer",
              background:
                selectedGroup?._id === group._id
                  ? "#ddd"
                  : "transparent"
            }}
          >

            {group.name}

          </div>

        ))

      }

    </div>
  );
}

export default Sidebar;