import React, {useState} from 'react';
import { ButtonToolbar, Button, Modal, Form } from 'react-bootstrap';
import ingredients from './images/ingredients.jpg';
import './TitlePage.css';
import { ApolloConsumer } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const LoginModal = (props: any) => {
  const [validatedForm, setValidatedForm] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(true);

  const handleSubmit = (event: any, client: ApolloClient<any>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidatedForm(true);
    } else {
      const email: String = form.formBasicEmail.value;
      const password: String = form.formBasicPassword.value;
      console.log(email);
      console.log(password);
      console.log("Sign 'em up!");
      setValidatedForm(false);
      setEnableSubmit(false);
      // TODO: Insert login API call

      // Assume signed in for now
      // set user metadata in global store, redirect to meal page
      client.writeData({
        data: {
          user: {
            __typename: "User",
            isLoggedIn: true,
            firstName: "Existing",
            lastName: "User",
            email: email
          }
        }
      });

    }
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ApolloConsumer>
          {client => (
            <Form
              noValidate
              validated={validatedForm}
              onSubmit={(e: any) => handleSubmit(e, client)}
            >
              <Form.Group controlId="formBasicEmail">
                <Form.Control required type="email" placeholder="Enter email"/>
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
                <Form.Control.Feedback type="invalid">Please enter a valid email</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Control required type="password" placeholder="Password"/>
                {/* TODO: make password validations */}
              </Form.Group>
              <Button type="submit" disabled={!enableSubmit}>Submit</Button>
            </Form>
          )}
        </ApolloConsumer>

      </Modal.Body>
    </Modal>
  );
};


const GET_USER_METADATA = gql`
    query {
        user @client {
            isLoggedIn
            firstName
            lastName
            email
        }
    }
`;

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
      </header>
      <Query query={GET_USER_METADATA}>
        {({data: { user } }) => {
          console.log(user.isLoggedIn);
          console.log(user.firstName);
          console.log(user.lastName);
          console.log(user.email);
          return (
            <div>
              <ul>isLoggedIn: {user.isLoggedIn.toString()}</ul>
              <ul>firstName: {user.firstName}</ul>
              <ul>lastName: {user.lastName}</ul>
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

