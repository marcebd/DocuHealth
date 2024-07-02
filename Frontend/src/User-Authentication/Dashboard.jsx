import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// Reusable Helmet component for setting head elements
const CustomHelmet = () => (
  <Helmet>
    <meta charSet="UTF-8" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    <title>Dashboard</title>
  </Helmet>
);

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      isLoading: false,
      error: ''
    };
  }

  componentDidMount() {
    // Code with side effects
  }

  render() {
    const { user, isLoading, error } = this.state;
    console.log(user);
    // Handle loading state
    if (isLoading) {
      return <p>Loading...</p>;
    }

    // Handle error state
    if (error) {
      return <p>Error loading the dashboard: {error}</p>;
    }

    return (
      <div>
        <HelmetProvider>
          <CustomHelmet />
        </HelmetProvider>
        <h1>Dashboard</h1>
        <a href="/logout" aria-label="Logout from Dashboard">Logout</a>
        <h4>Hello {user}</h4>
      </div>
    );
  }
}

// Prop types for Dashboard component
Dashboard.propTypes = {
  user: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

export default Dashboard;
