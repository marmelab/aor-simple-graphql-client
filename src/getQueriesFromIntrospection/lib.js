export const isNotGraphqlPrivateType = type => !type.name.startsWith('__');

export const isObject = type => type.kind === 'OBJECT';
