import React from 'react';


function Dashboard({ user }) {
  return (
    <div>
      <head>
        <meta charset="UTF-8" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Dashboard</title>
      </head>
      <body>
        <h1>Dashboard</h1>
        <a href="/users/logout">Logout</a>
        <h4>Hello {user}</h4>
      </body>
    </div>
  );
}

export default Dashboard;
