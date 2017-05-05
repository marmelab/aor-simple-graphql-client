import { TypeKind } from 'graphql';
import isNotGraphqlPrivateType from '../isNotGraphqlPrivateType';

export const isSubObject = field => {
    if (
        field.type.kind === TypeKind.OBJECT ||
        (field.type.kind === TypeKind.LIST &&
            (field.type.ofType.kind === TypeKind.OBJECT || field.type.ofType.kind === TypeKind.LIST)) ||
        (field.type.kind === TypeKind.NON_NULL &&
            (field.type.ofType.kind === TypeKind.OBJECT || field.type.ofType.kind === TypeKind.LIST))
    ) {
        return true;
    }

    return false;
};

const isExcludedFieldFactory = (resource, verbType, excludeFields) => field => {
    if (excludeFields) {
        if (Array.isArray(excludeFields)) {
            return excludeFields.includes(field.name);
        }

        if (typeof excludeFields === 'function') {
            return excludeFields(field, resource, verbType);
        }
    }

    return false;
};

export const buildFieldListFromList = (resource, fields, verbType, resources, types, options) => {
    const { excludeFields, ignoreSubObjects, ignoreSubResources } = options;
    const isExcludedField = isExcludedFieldFactory(resource, verbType, excludeFields);

    return fields
        .filter(isNotGraphqlPrivateType)
        .map(field => {
            if (isExcludedField(field)) {
                return false;
            }

            if (ignoreSubObjects && isSubObject(field, types)) {
                return false;
            }

            if (isSubObject(field, types)) {
                let typeToCheck = field.type;
                if (field.type.kind === TypeKind.LIST || field.type.kind === TypeKind.NON_NULL) {
                    typeToCheck = field.type.ofType;
                }

                if (!ignoreSubResources || !resources.some(r => r.name === typeToCheck.name)) {
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
