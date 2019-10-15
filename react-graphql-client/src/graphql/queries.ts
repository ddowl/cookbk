import { gql } from "apollo-boost";

export const GET_USER_METADATA = gql`
    query {
        user @client {
            isLoggedIn
            id
            email
        }
    }
`;