import './TitlePage.css';

import React, {useState} from 'react';
import { ButtonToolbar, Button, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ingredients from './images/ingredients.jpg';
import { ApolloConsumer } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
  // TODO: Can enforce password reqs here! :)
});

const LoginModal = (props: any) => {
  const handleSubmit = ({email, password}: { email: string, password: string}, client: ApolloClient<any>) => {
    console.log(email);
    console.log(password);
    console.log("Log 'em in!");
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
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ApolloConsumer>
          {client => (
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validationSchema={LoginSchema}
              onSubmit={(values, actions) => {
                actions.setSubmitting(false);
                handleSubmit(values, client);
                props.handleClose();
              }}
              render={({ errors, status, touched, isSubmitting }) => (
                // TODO: improve form CSS on invalid
                <Form>
                  <div className="form-group">
                    <Field type="email" name="email" className="form-control" placeholder="Email" />
                    <ErrorMessage name="email" component="div" />
                  </div>

                  <div className="form-group">
                    <Field type="password" name="password" className="form-control" placeholder="Password" />
                    <ErrorMessage name="password">
                      {errorMessage => <div className="error">{errorMessage}</div>}
                    </ErrorMessage>
                  </div>

                  {status && status.msg && <div>{status.msg}</div>}
                  <Button type="submit" disabled={isSubmitting}>Submit</Button>
                </Form>
              )}
            />
          )}
        </ApolloConsumer>
      </Modal.Body>
    </Modal>
  );
};

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
  // TODO: Can enforce password reqs here! :)
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords don't match")
    .required('Confirm Password is required'),
});

const SignupModal = (props: any) => {
  const handleSubmit = ({email, password}: { email: string, password: string}, client: ApolloClient<any>) => {
    console.log(email);
    console.log(password);
    console.log("Sign 'em up!");
    // TODO: Insert signup API call
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Signup</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ApolloConsumer>
          {client => (
            <Formik
              initialValues={{
                email: '',
                password: '',
                confirmPassword: ''
              }}
              validationSchema={SignupSchema}
              onSubmit={(values, actions) => {
                actions.setSubmitting(false);
                handleSubmit(values, client);
                props.handleClose();
              }}
              render={({ errors, status, touched, isSubmitting }) => (
                // TODO: improve form CSS on invalid
                <Form>
                  <div className="form-group">
                    <Field type="email" name="email" className="form-control" placeholder="Email" />
                    <ErrorMessage name="email" component="div" />
                  </div>

                  <div className="form-group">
                    <Field type="password" name="password" className="form-control" placeholder="Password" />
                    <ErrorMessage name="password" component="div" />
                  </div>

                  <div className="form-group">
                    <Field type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" />
                    <ErrorMessage name="confirmPassword" component="div" />
                  </div>

                  {status && status.msg && <div>{status.msg}</div>}
                  <Button type="submit" disabled={isSubmitting}>Submit</Button>
                </Form>
              )}
            />
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
        <SignupModal show={showSignupModal} handleClose={handleClose}/>
      </header>
      <Query query={GET_USER_METADATA}>
        {({data: { user } }) => {
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
