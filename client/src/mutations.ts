import { gql } from "apollo-boost";

export const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
        existingUser: login(email: $email, password: $password) {
            id
            email
        }
    }
`;

export const SIGNUP_USER = gql`
    mutation SignupUser($email: String!, $password: String!) {
        newUser: signup(email: $email, password: $password) {
            id
            email
        }
    }
`;