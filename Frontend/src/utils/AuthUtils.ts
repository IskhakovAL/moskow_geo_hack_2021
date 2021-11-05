interface IAuthStorage {
    login: string;
}

const authKeys: IAuthStorage = {
    login: null,
};

class AuthUtils {
    private prefix = '';

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    setAuthMetadata(data: IAuthStorage) {
        Object.keys(data).forEach((key: keyof IAuthStorage) => {
            if (!(key in authKeys)) {
                console.warn(`unexpected auth key ${key}`);
            } else {
                const value = data[key];

                if (value) {
                    localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
                }
            }
        });
    }

    getAuthMetadata(): IAuthStorage {
        const out = {} as IAuthStorage;

        Object.keys(authKeys).forEach((key: keyof IAuthStorage) => {
            const value = localStorage.getItem(`${this.prefix}${key}`);

            try {
                out[key] = JSON.parse(value);
            } catch (e) {
                out[key] = value;
            }
        });

        return out;
    }

    clearAuthMetadata() {
        Object.keys(authKeys).forEach((key) => {
            localStorage.removeItem(`${this.prefix}${key}`);
        });
    }
}

export default new AuthUtils('interactive-map');
