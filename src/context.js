function Context() {
    this._stubs = {};
}

Context.prototype.addStub = function (url, module, isDefault = true) {
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
};

Context.prototype.getStubs = function () {
    return this._stubs;
};

Context.prototype.reset = function () {
    this._stubs = {};
};

export default new Context();