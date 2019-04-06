import './TitlePage.css';

import React, {useState} from 'react';
import { ButtonToolbar, Button, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ingredients from './images/ingredients.jpg';
import {FetchResult} from 'react-apollo';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import {DataProxy} from 'apollo-cache';
import Mutation from "react-apollo/Mutation";


const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
        existingUser: login(email: $email, password: $password) {
            id
            email
        }
    }
`;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
  // TODO: Can enforce password reqs here! :)
});

const LoginModal = (props: any) => {
  const handleLoginUpdate = (cache: DataProxy, mutationResult: FetchResult) => {
    props.handleClose();
    cache.writeQuery({
      query: GET_USER_METADATA,
      data: { user: { __typename: "User", isLoggedIn: true, email: mutationResult.data!.existingUser.email } },
    });
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Mutation mutation={LOGIN_USER} update={handleLoginUpdate}>
          {(loginUser, { loading, error }) => (
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validationSchema={LoginSchema}
              onSubmit={(formValues, actions) => {
                actions.setSubmitting(false);
                loginUser({ variables: formValues })
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
                  {loading && <p>Loading...</p>}
                  {error && <p>Error :( Please try again { errors }</p>}
                </Form>
              )}
            />
          )}
        </Mutation>
      </Modal.Body>
    </Modal>
  );
};


const SIGNUP_USER = gql`
  mutation SignupUser($email: String!, $password: String!) {
      newUser: signup(email: $email, password: $password) {
          id
          email
      }
  }
`;

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
  const handleSignupUpdate = (cache: DataProxy, mutationResult: FetchResult) => {
    props.handleClose();
    cache.writeQuery({
      query: GET_USER_METADATA,
      data: { user: { __typename: "User", isLoggedIn: true, email: mutationResult.data!.newUser.email } },
    });
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Signup</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Mutation mutation={SIGNUP_USER} update={handleSignupUpdate}>
          {(signupUser, { loading, error }) => (
            <Formik
              initialValues={{
                email: '',
                password: '',
                confirmPassword: ''
              }}
              validationSchema={SignupSchema}
              onSubmit={(formValues, actions) => {
                actions.setSubmitting(false);
                signupUser({ variables: formValues })
              }}
            >
              {({ errors, status, touched, isSubmitting }) => (
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
                  {loading && <p>Loading...</p>}
                  {error && <p>Error :( Please try again { errors }</p>}
                </Form>
              )}
            </Formik>
          )}
        </Mutation>
      </Modal.Body>
    </Modal>
  );
};

const GET_USER_METADATA = gql`
    query {
        user @client {
            isLoggedIn
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
