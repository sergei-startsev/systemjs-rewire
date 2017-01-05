# systemjs-rewire
SystemJS wrapper based on babel plugin [rewire-exports](https://github.com/asapach/babel-plugin-rewire-exports) for stubbing ES modules. Unlike standalone [rewire-exports](https://github.com/asapach/babel-plugin-rewire-exports) plugin it provides compact high-level API for overriding module dependencies while staying fully compatible.

## Example

### Default export

```javascript
//------ logger.js ------
export default function (message) {
  console.log(message);
}

//------ fetch.js ------
export default function (url){
}

//------ handle.js ------
export default function (e) {
}

//------ provider.js ------
import log from './logger.js';
import handle from './handle.js';
import fetch from './fetch.js';

export function getItems() {
  try {
    log('Getting items...');
    fetch('/items');
    log('Successful');
  } catch (e) {
    handle(e);
  }
}

//------ test.js ------
import { rewire, restore } from 'systemjs-rewire';
import {getItems} from './provider.js';

describe('provider', function () {
  beforeEach(function (done) {
    rewire('logger.js', this.spyLogger = jasmine.createSpy('logger'))
    .rewire('handle.js', this.spyHandler = jasmine.createSpy('handle'))
    .rewire('fetch.js', this.spyFetch = jasmine.createSpy('fetch'))
    .then(done);
  });
  afterAll(function(done){
      restore.then(done);
  });

  it('should call fetch', function () {
    getItems();

    expect(this.spyLogger).toHaveBeenCalledWith('Getting items...');
    expect(this.spyLogger).toHaveBeenCalledWith('Successful');

    expect(this.spyHandler).not.toHaveBeenCalled();

    expect(this.spyFetch).toHaveBeenCalledWith('/items');
  });
});
```
Compare the same test with standalone `rewire-exports`:

```javascript
//------ test.js ------
import {rewireLog, restoreLog} from './log.js';
import {rewireHandle, restoreHandle} from './handle.js';
import {rewireFetch, restoreFetch} from './fetch.js';
import {getItems} from './provider.js';

describe('provider', function () {
  beforeEach(function () {
    rewireLog(this.spyLogger = jasmine.createSpy('logger'));
    rewireHandle(this.spyHandler = jasmine.createSpy('handle'));
    rewireFetch(this.spyFetch = jasmine.createSpy('fetch'));
  });
  afterAll(function(){
      restoreLog();
      restoreHandle();
      restoreFetch();
  });

  it('should call fetch', function () {
    getItems();

    expect(this.spyLogger).toHaveBeenCalledWith('Getting items...');
    expect(this.spyLogger).toHaveBeenCalledWith('Successful');

    expect(this.spyHandler).not.toHaveBeenCalled();

    expect(this.spyFetch).toHaveBeenCalledWith('/items');
  });
});
```


### Named export

## Usage
//TODO

## API
//TODO

## Features 
See [rewire-exports](https://github.com/asapach/babel-plugin-rewire-exports).

## Installation
//TODO


