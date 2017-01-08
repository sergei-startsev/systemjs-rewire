# systemjs-rewire
SystemJS wrapper is based on [rewire-exports](https://github.com/asapach/babel-plugin-rewire-exports) babel plugin and designed for stubbing ES modules. Unlike standalone [rewire-exports](https://github.com/asapach/babel-plugin-rewire-exports) plugin it provides compact high-level API for overriding module dependencies while staying fully compatible.

## Example

### Default exports

#### Employees:
```javascript
//------ fullTime.js ------
export default function FullTime(type) {
    this.type = type;
    this.hourly = "$12";
};

//------ partTime.js ------
export default function PartTime(type) {
    this.type = type;
    this.hourly = "$11";
};

//------ temporary.js ------
export default function Temporary(type) {
    this.type = type;
    this.hourly = "$10";
};

//------ contractor.js ------
export default function Contractor(type) {
    this.type = type;
    this.hourly = "$15";
};
```

#### Factory
```javascript
//------ factory.js ------
import FullTime from './fullTime.js';
import PartTime from './parttime.js';
import Temporary from './temporary.js';
import Contractor from './contractor.js';

export default function Factory() {
    this.createEmployee = function (type) {
        var employee;
 
        if (type === "fulltime") {
            employee = new FullTime(type);
        } else if (type === "parttime") {
            employee = new PartTime(type);
        } else if (type === "temporary") {
            employee = new Temporary(type);
        } else if (type === "contractor") {
            employee = new Contractor(type);
        }
 
        employee.say = function () {
            console.log(`${this.type}: rate is ${this.hourly} per hour.`);
        }
 
        return employee;
    }
}
```

#### Tests
```javascript
//------ test.js ------
import { rewire, restore } from 'systemjs-rewire';
import Factory from './factory.js';

describe('Factory', function () {

    beforeEach(function (done) {
        // stub employees and tracks calls and arguments
        rewire('fullTime.js', this.fullTime = jasmine.createSpy('fullTime'))
        .rewire('partTime.js', this.partTime = jasmine.createSpy('partTime'))
        .rewire('temporary.js', this.temporary = jasmine.createSpy('temporary'))
        .rewire('contractor.js', this.contractor = jasmine.createSpy('contractor'))
        .then(() => {
            //create a factory instance with subbed employees
            this.factory = new Factory();
            done();
        });
    });

    afterAll(function (done) {
        restore.then(done);
    });

    it('should create FullTime employee properly', function () {
        this.factory.createEmployee("fulltime");

        expect(this.fullTime).toHaveBeenCalledWith('fulltime');
    });

    it('should create PartTime employee properly', function () {
        this.factory.createEmployee("partTime");

        expect(this.fullTime).toHaveBeenCalledWith('partTime');
    });

    it('should create Temporary employee properly', function () {
        this.factory.createEmployee("temporary");

        expect(this.fullTime).toHaveBeenCalledWith('temporary');
    });

    it('should create Contractor employee properly', function () {
        this.factory.createEmployee("contractor");

        expect(this.fullTime).toHaveBeenCalledWith('contractor');
    });
});
```

Compare the same test with standalone `rewire-exports` plugin:

```javascript
//------ test.js ------
import {rewireFullTime, restoreFullTime} from './fullTime.js';
import {rewirePartTime, restorePartTime} from './partTime.js';
import {rewireTemporary, restoreTemporary} from './temporary.js';
import {rewireContractor, restoreContractor} from './contractor.js';
import Factory from './factory.js';

describe('Factory', function () {
    beforeEach(function () {
        // stub employees and tracks calls and arguments
        rewireFullTime(this.fullTime = jasmine.createSpy('fullTime'));
        rewirePartTime(this.partTime = jasmine.createSpy('partTime'));
        rewireTemporary(this.temporary = jasmine.createSpy('temporary'));
        rewireContractor(this.contractor = jasmine.createSpy('contractor'));

        //create a factory instance with subbed employees
        this.factory = new Factory();
    });
    afterAll(function () {
        restoreFullTime();
        restorePartTime();
        restoreTemporary();
        restoreContractor();
    });
    ...
});
```

### Named exports

Let's consider that employees are named exports:

#### Employees:
```javascript
//------ employees.js ------

export function FullTime(type) {
    this.type = type;
    this.hourly = "$12";
};

export function PartTime(type) {
    this.type = type;
    this.hourly = "$11";
};

export function Temporary(type) {
    this.type = type;
    this.hourly = "$10";
};

export function Contractor(type) {
    this.type = type;
    this.hourly = "$15";
};
```

#### Factory
```javascript
//------ factory.js ------
import {FullTime, PartTime, Temporary, Contractor} from './employees.js';

export default function Factory() {
    this.createEmployee = function (type) {
        var employee;
 
        if (type === "fulltime") {
            employee = new FullTime(type);
        } else if (type === "parttime") {
            employee = new PartTime(type);
        } else if (type === "temporary") {
            employee = new Temporary(type);
        } else if (type === "contractor") {
            employee = new Contractor(type);
        }
 
        employee.say = function () {
            console.log(`${this.type}: rate is ${this.hourly} per hour.`);
        }
 
        return employee;
    }
}
```

#### Tests
```javascript
//------ test.js ------
import { rewire, restore } from 'systemjs-rewire';
import Factory from './factory.js';

describe('Factory', function () {

    beforeEach(function (done) {
        // stub employees and tracks calls and arguments
        rewire('employees.js', {
            FullTime: this.fullTime = jasmine.createSpy('fullTime'),
            PartTime: this.partTime = jasmine.createSpy('partTime'),
            Temporary: this.temporary = jasmine.createSpy('temporary'),
            Contractor: this.contractor = jasmine.createSpy('contractor')
        }, false)
        .then(() => {
            //create a factory instance with subbed employees
            this.factory = new Factory();
            done();
        });
    });

    afterAll(function (done) {
        restore.then(done);
    });

    it('should create FullTime employee properly', function () {
        this.factory.createEmployee("fulltime");

        expect(this.fullTime).toHaveBeenCalledWith('fulltime');
    });

    it('should create PartTime employee properly', function () {
        this.factory.createEmployee("partTime");

        expect(this.fullTime).toHaveBeenCalledWith('partTime');
    });

    it('should create Temporary employee properly', function () {
        this.factory.createEmployee("temporary");

        expect(this.fullTime).toHaveBeenCalledWith('temporary');
    });

    it('should create Contractor employee properly', function () {
        this.factory.createEmployee("contractor");

        expect(this.fullTime).toHaveBeenCalledWith('contractor');
    });
});
```

## Usage
//TODO

## API
//TODO

## Features 
See [rewire-exports](https://github.com/asapach/babel-plugin-rewire-exports).

## Installation
//TODO


