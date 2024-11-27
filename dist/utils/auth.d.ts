export declare const hashPassword: (password: string) => Promise<string>;
export declare const checkPassword: (enteredPassword: string, storeHash: string) => Promise<boolean>;
