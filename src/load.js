export default function load(injections) {
    return Promise
        .all(Object.keys(injections).map(moduleURL => { return System.import(moduleURL); }))
        .then(originalModules => {
            return Object.keys(injections).reduce((prevValue, value, index) => {
                prevValue[value] = originalModules[index];
                return prevValue;
            }, {});
        });
}