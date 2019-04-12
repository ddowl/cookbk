import React, { ReactNode, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FetchResult } from "react-apollo";
import { DataProxy } from 'apollo-cache';
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Mutation from "react-apollo/Mutation";
import { GET_USER_METADATA } from "../graphql/queries";
import { ApolloError } from "apollo-client/errors/ApolloError";

interface MinimalUserFormInputs {
  email: string
  password: string
  [key: string]: string // you can put other stuff here too
}

interface UserSessionModalProps {
  show: boolean
  title: string
  initialValues: MinimalUserFormInputs
  formSchema: Yup.ObjectSchema<Yup.Shape<object, any>>
  userMutation: any
  children: ReactNode
  handleClose(): void
  handleError?(error: ApolloError, email: string, password: string): void
}

const UserSessionModal = (props: UserSessionModalProps) => {
  const [email, setEmail] = useState(props.initialValues.email);
  const [password, setPassword] = useState(props.initialValues.password);

  const handleUpdate = (cache: DataProxy, mutationResult: FetchResult) => {
    props.handleClose();

    const userAlias = props.userMutation.definitions[0].selectionSet.selections[0].alias.value;
    cache.writeQuery({
      query: GET_USER_METADATA,
      data: { user: { __typename: "User", isLoggedIn: true, email: mutationResult.data![userAlias].email } },
    });
  };

  const handleError = (e: ApolloError) => {
    console.log(e.message);
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);
    if (props.handleError) {
      props.handleError(e, email, password);
    }
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Mutation
          mutation={props.userMutation}
          update={handleUpdate}
          onError={handleError}
        >
          {(mutateUserFunc, { loading, error }) => (
            <Formik
              initialValues={props.initialValues}
              validationSchema={props.formSchema}

              // Assumes that at least "email" and "password" are passed to the mutation func
              onSubmit={(formValues, actions) => {
                actions.setSubmitting(false);
                setEmail(formValues.email);
                setPassword(formValues.password);
                mutateUserFunc({ variables: formValues })
              }}

              render={({ errors, status, touched, isSubmitting }) => (
                // TODO: improve form CSS on invalid
                <Form>
                  { props.children }
                  <Button type="submit" disabled={isSubmitting}>Submit</Button>
                  {status && status.msg && <div>{status.msg}</div>}
                  {loading && <p>Loading...</p>}
                  {error && <p>{ error.message }</p>}
                </Form>
              )}
            />
          )}
        </Mutation>
      </Modal.Body>
    </Modal>
  );
};



export default UserSessionModal;