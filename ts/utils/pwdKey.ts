export const pwdKey = {
    int10To62 (n: number) {
        const c = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'; let s = '', t;
        do {
            t = n % 62;
            n = (n - t) / 62;
            s = c.charAt(t) + s;
        }
        while (n);
        return s;
    },
    generateId() {
        return 'xxx'.replace(/x/g, () => (Math.random() * 36 | 0).toString(36))
            + (('0x' + new Date().getTime()as any).toString(16) << 1).toString(36).replace(/^-/, '');
    },
    paraFilter(obj) {
        for (const i in obj) {
            if (obj[i] === undefined || obj[i] === '' || obj[i] === null) delete obj[i];
        }
        return obj;
    },
};