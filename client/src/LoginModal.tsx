import React from "react";
import { Button, Modal } from "react-bootstrap";
import { FetchResult } from "react-apollo";
import { DataProxy } from 'apollo-cache';
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Mutation from "react-apollo/Mutation";
import { GET_USER_METADATA } from "./queries";
import { LOGIN_USER } from "./mutations";

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

export default LoginModal;