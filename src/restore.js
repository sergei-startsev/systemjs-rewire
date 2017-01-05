import context from './context.js';
import load from './load.js';

export function restore() {
    return load(context.getStubs())
        .then(originalModules => {
            Object.keys(context.getStubs()).forEach(url => {
                var meta = context.getStubs()[url];
                if (meta.isDefault) {
                    originalModules[url].restore();
                }
            });
        });
}