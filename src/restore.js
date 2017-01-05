import context from './context.js';
import load from './load.js';

export function restore() {
    return load(context.getInjections())
        .then(originalModules => {
            Object.keys(context.getInjections()).forEach(moduleURL => {
                var meta = context.getInjections()[moduleURL];
                if (meta.isDefault) {
                    originalModules[moduleURL].restore();
                }
            });
        });
}