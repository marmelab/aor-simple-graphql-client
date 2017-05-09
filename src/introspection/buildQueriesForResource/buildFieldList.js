import { TypeKind } from 'graphql';
import isNotGraphqlPrivateType from '../isNotGraphqlPrivateType';

export const isSubObject = field => {
    return (
        field.type.kind === TypeKind.OBJECT ||
        (field.type.kind === TypeKind.LIST &&
            (field.type.ofType.kind === TypeKind.OBJECT || field.type.ofType.kind === TypeKind.LIST)) ||
        (field.type.kind === TypeKind.NON_NULL &&
            (field.type.ofType.kind === TypeKind.OBJECT || field.type.ofType.kind === TypeKind.LIST))
    );
};

const isExcludedFieldFactory = (resource, verbType, excludeFields) => field => {
    if (!excludeFields) {
        return false;
    }

    if (Array.isArray(excludeFields)) {
        return excludeFields.includes(field.name);
    }

    if (typeof excludeFields === 'function') {
        return excludeFields(field, resource, verbType);
    }
};

const getType = field => {
    if (field.type.kind === TypeKind.LIST || field.type.kind === TypeKind.NON_NULL) {
        return field.type.ofType;
    }

    return field.type;
};

const isResource = (field, resources) => {
    const type = getType(field);

    return resources.some(r => r.name === type.name);
};

export const buildFieldListFromList = (resource, fields, verbType, resources, types, options) => {
    const { excludeFields, ignoreSubObjects, ignoreSubResources } = options;
    const isExcludedField = isExcludedFieldFactory(resource, verbType, excludeFields);

    return fields
        .filter(isNotGraphqlPrivateType)
        .filter(field => !isExcludedField(field))
        .filter(field => (ignoreSubObjects && !isSubObject(field, types)) || !ignoreSubObjects)
        .map(field => {
            if (isSubObject(field, types)) {
                let typeToCheck = getType(field);

                if (!ignoreSubResources || !isResource(field, resources)) {
                    const type = types.find(t => t.name === typeToCheck.name);

                    if (type) {
                        const subFields = buildFieldListFromList(
                            resource,
                            type.fields,
                            verbType,
                            resources,
                            types,
                            options,
                        );
                        return `${field.name} { ${subFields} }`;
                    }
                }

                return false;
            }

            return field.name;
        })
        .filter(f => f !== false)
        .join(' ');
};

export default (resource, verbType, resources, types, options) =>
    buildFieldListFromList(resource, resource.fields, verbType, resources, types, options);
