'use client'

import { AccountMetadataFragment, graphql, PublicClient, testnet, UsernameFragment,  } from "@lens-protocol/client";


export const AccountFragment = graphql(`
    fragment Account on Account {
      username(request: {namespace: "0x0c978F29b462762A1b64e10E0c7052353E743a2e"}) {
        ...Username
      }
      address
      owner
      metadata {
        ...AccountMetadata
      }

    }

    fragment LoggedInFeedPostOperations on LoggedInFeedPostOperations {
      __typename
      id

    }
    
    fragment Post on Post {
      __typename
      id
      author {
        ...Account
      }
      timestamp
      app {
        address
        metadata {
          name
          logo
        }
      }
      metadata {
        ...PostMetadata
      }
      root {
        ...ReferencedPost
      }
      quoteOf {
        ...ReferencedPost
      }
      commentOn {
        ...ReferencedPost
      }
      stats {
        ...PostStats
      }
      operations {
        ...LoggedInPostOperations
      }
    }
  `,
  [UsernameFragment, AccountMetadataFragment]
);

const storage = typeof window !== "undefined" ? window.localStorage : undefined;


export const client = PublicClient.create({
  environment: testnet,
  fragments: [AccountFragment],
  storage,
});