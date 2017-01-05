import context from './context.js';
import load from './load.js';

export function rewire(...args) {
    function _rewire(...args) {
        context.addInjection(...args);

        this.rewire = (...args) => {
            return new _rewire(...args);
        };

        this.then = (resolve) => {
            return load(context.getInjections())
                .then(originalModules => {
                    Object.keys(context.getInjections()).forEach(moduleURL => {
                        var meta = context.getInjections()[moduleURL];
                        if (meta.isDefault) {
                            originalModules[moduleURL].rewire(meta.module);
                        } else {
                            Object.keys(meta.module).forEach(namedExport => {
                                originalModules[moduleURL][`rewire$${namedExport}`](meta.module[namedExport]);
                            });
                        }
                    });
                })
                .then(resolve);
        };
    }
    return new _rewire(...args);
}