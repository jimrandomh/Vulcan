/*

Generic mutation wrapper to edit a document in a collection. 

Sample mutation: 

  mutation moviesEdit($documentId: String, $set: MoviesInput, $unset: MoviesUnset) {
    moviesEdit(documentId: $documentId, set: $set, unset: $unset) {
      ...MoviesEditFormFragment
    }
  }

Arguments: 

  - documentId: the id of the document to modify
  - set: an object containing all the fields to modify and their new values
  - unset: an object containing the fields to unset

Child Props:

  - editMutation(documentId, set, unset)
  
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection } from 'meteor/vulcan:lib';

export default function withEdit(options) {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName),
        fragment = options.fragment || getFragment(options.fragmentName),
        fragmentName = getFragmentName(fragment),
        mutationName = collection.options.mutations.edit.name;

  return graphql(gql`
    mutation ${mutationName}($documentId: String, $set: ${collection.options.collectionName}Input, $unset: ${collection.options.collectionName}Unset) {
      ${mutationName}(documentId: $documentId, set: $set, unset: $unset) {
        ...${fragmentName}
      }
    }
    ${fragment}
  `, {
    alias: 'withEdit',
    options: () => ({
      ssr: false,
    }),
    props: ({ ownProps, mutate }) => ({
      editMutation: (args) => {
        const { documentId, set, unset } = args;
        return mutate({ 
          variables: { documentId, set, unset }
          // note: updateQueries is not needed for editing documents
        });
      }
    }),
  });

}