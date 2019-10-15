import React from "react";
import { ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { SIGNUP_USER } from "../graphql/mutations";
import UserSessionModal from "./UserSessionModal";

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

interface SignupModalProps {
  show: boolean
  handleClose(): void
}

const SignupModal = (props: SignupModalProps) => (
  <UserSessionModal
    show={props.show}
    title={'Signup'}
    initialValues={{
      email: '',
      password: '',
      confirmPassword: ''
    }}
    formSchema={SignupSchema}
    userMutation={SIGNUP_USER}
    handleClose={props.handleClose}
  >
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
  </UserSessionModal>
);

export default SignupModal;