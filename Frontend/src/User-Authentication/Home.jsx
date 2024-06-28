import React from 'react';

function Home({ message }) {
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
        <title>Home</title>
      </head>
      <body>
        <h1>Home</h1>
        {message && <p>{message}</p>}
      </body>
    </div>
  );
}

export default Home;
