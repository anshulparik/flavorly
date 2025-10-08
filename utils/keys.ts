export const getKeyName = (...args: string[]) => {
    return `flavorly:${args.join(':')}`;
}

export const restaurantKeyById = (id: string) => getKeyName("restaurants", id);