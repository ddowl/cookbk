import React from "react";
import { ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { LOGIN_USER } from "./mutations";
import UserSessionModal from "./UserSessionModal";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
  // TODO: Can enforce password reqs here! :)
});

interface LoginModalProps {
  show: boolean
  handleClose(): void
}

const LoginModal = (props: LoginModalProps) => (
  <UserSessionModal
    show={props.show}
    title={'Login'}
    initialValues={{
      email: '',
      password: '',
    }}
    formSchema={LoginSchema}
    userMutation={LOGIN_USER}
    handleClose={props.handleClose}
  >
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
  </UserSessionModal>
);

export default LoginModal;