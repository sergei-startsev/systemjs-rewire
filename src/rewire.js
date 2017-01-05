import context from './context.js';
import load from './load.js';

export function rewire(...args) {
    function _rewire(...args) {
        context.addStub(...args);

        this.rewire = (...args) => {
            return new _rewire(...args);
        };

        this.then = (resolve) => {
            return load(context.getStubs())
                .then(originalModules => {
                    Object.keys(context.getStubs()).forEach(url => {
                        var meta = context.getStubs()[url];
                        if (meta.isDefault) {
                            originalModules[url].rewire(meta.module);
                        } else {
                            Object.keys(meta.module).forEach(namedExport => {
                                originalModules[url][`rewire$${namedExport}`](meta.module[namedExport]);
                            });
                        }
                    });
                })
                .then(resolve);
        };
    }
    return new _rewire(...args);
}