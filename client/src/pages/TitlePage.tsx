import './TitlePage.css';

import React, {useState} from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import { Query } from 'react-apollo';
import { GET_USER_METADATA } from "../graphql/queries";
import SignupModal from "../components/SignupModal";
import LoginModal from "../components/LoginModal";
import ingredients from '../images/ingredients.jpg';

const TitlePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleLogin = () => {
    console.log("login!");
    setShowLoginModal(true);
  };

  const handleSignup = () => {
    console.log("signup!");
    setShowSignupModal(true);
  };

  const handleClose = () => {
    console.log("closing modal!");
    setShowLoginModal(false);
    setShowSignupModal(false)
  };

  const headerStyle = {
    backgroundImage: `url(${ingredients})`
  };

  return (
    <div className="TitlePage">
      <header className="TitlePage-header" style={headerStyle}>
        <h1 className="hero-title">Cookbk</h1>
        <ButtonToolbar>
          <Button className="login-button" variant="primary" onClick={handleLogin}>Login</Button>
          or
          <Button className="signup-button" variant="secondary" onClick={handleSignup}>Signup</Button>
        </ButtonToolbar>
        <LoginModal show={showLoginModal} handleClose={handleClose}/>
        <SignupModal show={showSignupModal} handleClose={handleClose}/>
      </header>
      <Query query={GET_USER_METADATA}>
        {({data: { user } }) => {
          console.log(user);
          return (
            <div>
              <ul>isLoggedIn: {user.isLoggedIn.toString()}</ul>
              <ul>email: {user.email}</ul>
            </div>
          );
        }}
      </Query>
      <p>More content will go down here later!</p>
    </div>
  );
};

export default TitlePage;
