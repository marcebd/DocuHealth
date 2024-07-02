import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

// Reusable Helmet component for setting head elements
const CustomHelmet = () => (
  <Helmet>
    <meta charSet="UTF-8" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    <title>Home</title>
  </Helmet>
);

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  componentDidMount() {
    // Code with side effects
  }

  render() {
    const { message } = this.state;

    return (
      <div>
        <HelmetProvider>
          <CustomHelmet />
        </HelmetProvider>
        <h1>Home</h1>
        {message ? <p>{message}</p> : <p>Loading message...</p>}
      </div>
    );
  }
}

// Prop types for Home component
Home.propTypes = {
  message: PropTypes.string
};

export default Home;
