import React from "react";
import { FetchResult } from "react-apollo";
import { DataProxy } from 'apollo-cache';
import { Button, Modal } from "react-bootstrap";
import Mutation from "react-apollo/Mutation";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { GET_USER_METADATA } from "./queries";
import { SIGNUP_USER } from "./mutations";

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

export default SignupModal;