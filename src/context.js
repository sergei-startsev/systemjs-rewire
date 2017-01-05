class Context {
    constructor() {
        this._stubs = {};
    }

    addStub(url, module, isDefault = true) {
        if (!Array.isArray(url)) {
            this._stubs[url] = { module, isDefault };
        } else {
            url.forEach(item => {
                this._stubs[item.url] = {
                    module: item.module,
                    isDefault: typeof item.isDefault === 'undefined' ? true : item.isDefault
                };
            });
        }
    }

    getStubs() {
        return this._stubs;
    }

    reset() {
        this._stubs = {};
    }
}

export default new Context();