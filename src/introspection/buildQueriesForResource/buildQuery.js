import buildFieldList from './buildFieldList';

export const buildQueryFactory = buildFieldListImpl => (
    queryDefinition,
    verbType,
    resource,
    queries,
    resources,
    types,
    options,
) => {
    const operationName = queryDefinition.operationName(resource);
    const query = queries.find(q => q.name === operationName);

    if (!query) {
        return undefined;
    }

    const fields = buildFieldListImpl(verbType, resource, resources, types, options);

    return queryDefinition.query(operationName, fields);
};

export default buildQueryFactory(buildFieldList);
