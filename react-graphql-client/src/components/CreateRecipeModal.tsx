import React  from "react";
import { Button, Modal } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Mutation, { FetchResult } from "react-apollo/Mutation";
import { gql } from "apollo-boost";
import { DataProxy } from 'apollo-cache';
import { ApolloError } from "apollo-client/errors/ApolloError";
import * as Yup from "yup";
import { GET_USER_METADATA } from "../graphql/queries";

const CREATE_RECIPE = gql`
  mutation CreateRecipe($name: String!, $description: String!, $maxServingWaitTime: Int, $authorId: ID!) {
    newRecipe: createRecipe(name: $name, description: $description, maxServingWaitTime: $maxServingWaitTime, authorId: $authorId) {
      id
      name
      description
    }
  }
`;

const CreateRecipeSchema = Yup.object().shape({
  name: Yup.string()
    .required('Recipe needs a name'),
  description: Yup.string()
    .required('Give your recipe a short description'),
  maxServingWaitTime: Yup.number()
    .notRequired()
    .min(0, "Please keep wait time positive")
    .integer("Please round wait time to a whole number")
});

interface CreateRecipeModalProps {
  show: boolean
  title: string
  handleClose(): void
}

const CreateRecipeModal = (props: CreateRecipeModalProps) => {
  const handleUpdate = (cache: DataProxy, mutationResult: FetchResult) => {
    props.handleClose();
    console.log("Received result from createRecipe");
    console.log(mutationResult);
  };

  const handleError = (error: ApolloError) => {
    console.log(error.message);
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Mutation
          mutation={CREATE_RECIPE}
          update={handleUpdate}
          onError={handleError}
        >
          {(createRecipe, { loading, error, client }) => (
            <Formik
              initialValues={{
                name: '',
                description: '',
                maxServingWaitTime: ''
              }}
              validationSchema={CreateRecipeSchema}

              // Assumes that at least "email" and "password" are passed to the mutation func
              onSubmit={({ name, description, maxServingWaitTime }, actions) => {
                actions.setSubmitting(false);
                if (maxServingWaitTime === "") {
                  // wait time wasn't set
                  maxServingWaitTime = "60";
                }

                createRecipe({
                  variables: {
                    name,
                    description,
                    maxServingWaitTime: Number(maxServingWaitTime),
                    authorId: client.readQuery({query: GET_USER_METADATA}).user.id
                  }
                })
              }}

              render={({ errors, status, touched, isSubmitting }) => (
                // TODO: improve form CSS on invalid
                <Form>
                  <div className="form-group">
                    <Field name="name" className="form-control" placeholder="Name" />
                    <ErrorMessage name="name" component="div" />
                  </div>

                  <div className="form-group">
                    <Field component="textarea" name="description" className="form-control" placeholder="Description" />
                    <ErrorMessage name="description" component="div" />
                  </div>

                  <div className="form-group">
                    <Field name="maxServingWaitTime" className="form-control" placeholder="Wait Time" />
                    {/*TODO: make this into a hover help, or only show in a link*/}
                    <label>
                      This is an optional value that denotes how long you're willing to wait before eating (in minutes).
                      If the yield of this recipe cools off quickly, give it a small wait time so our algorithm knows!
                      If you leave this field blank, we assume that you're willing to wait an arbitrary amount of time.
                    </label>
                    <ErrorMessage name="maxServingWaitTime" component="div" />
                  </div>
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

export default CreateRecipeModal;