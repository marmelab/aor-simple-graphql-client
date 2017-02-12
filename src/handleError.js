export default (error) => {
    if (error.graphQLErrors && error.graphQLErrors.length) {
        throw new Error(error.graphQLErrors[0].message);
    }

    if (error.networkError) {
        throw new Error(error.networkError.message);
    }

    throw error;
};
