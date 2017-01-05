export default function load(modules) {
    return Promise
        .all(Object.keys(modules).map(url => { return System.import(url); }))
        .then(originalModules => {
            return Object.keys(modules).reduce((prevValue, value, index) => {
                prevValue[value] = originalModules[index];
                return prevValue;
            }, {});
        });
}