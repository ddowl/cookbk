import React, {useEffect, useState} from 'react';

interface User {
  id: number,
  name: string,
  email: string
}

const UserDisplay = () => {
  // Declare a new state variable, which we'll call "count"
  const [user, setUser] = useState("");
  useEffect(() => {
    console.log("Called the effect!");
    fetch("http://localhost:3001/api/users")
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Got some users!");
          result.map((user: User) => {
            console.log(user.id);
            console.log(user.name);
            console.log(user.email);
          });
        },
        (error) => {
          console.log("Error occurred");
          console.log(error);
        }
      );
  });

  return (
    <div>
      <a>"I'll be a user pretty soon"</a>
      { user }
    </div>
  );
};

export default UserDisplay;