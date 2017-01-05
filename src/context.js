function Context() {
    this._injections = {};
}

Context.prototype.addInjection = function (moduleURL, module, isDefault = true) {
    if (!Array.isArray(moduleURL)) {
        this._injections[moduleURL] = { module, isDefault };
    } else {
        moduleURL.forEach(item => {
            this._injections[item.url] = {
                module: item.module,
                isDefault: typeof item.isDefault === 'undefined' ? true : item.isDefault
            };
        });
    }
};

Context.prototype.getInjections = function () {
    return this._injections;
};

Context.prototype.reset = function () {
    this._injections = {};
};

export default new Context();