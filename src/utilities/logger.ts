const isTestEnv = process.env.NODE_ENV === 'test';

export const logger = {
    info: (...context: any) => {
        if (!isTestEnv) console.log(...context);
    },
    warn: (...context: any) => {
        if (!isTestEnv) console.warn(...context);
    },
    error: (err: Error | unknown, message?: string) => {
        if (!isTestEnv) console.error(err, message);
    }
};
