export const getKeyName = (...args: string[]) => {
    return `flavorly:${args.join(':')}`;
}