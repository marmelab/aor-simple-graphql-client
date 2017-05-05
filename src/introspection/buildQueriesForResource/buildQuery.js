import buildFieldList from './buildFieldList';

export const buildQueryFactory = buildFieldListImpl => (resource, verbType, queries, resources, types, options) => {
    const operationName = options.templates[verbType.name](resource);
    const query = queries.find(q => q.name === operationName);

    if (!query) {
        return undefined;
    }

    let fields;
    if (verbType.returnsFields) {
        fields = buildFieldListImpl(resource, verbType, resources, types, options);
    }

    return verbType.query(operationName, fields);
};

export default buildQueryFactory(buildFieldList);
