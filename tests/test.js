import { expect } from 'chai';
import { __Rewire__ } from '../src/a-module';
import sinon from 'sinon';
import dep from '../src/a-dependency';
import * as me from '../src/a-module';

const dependencyMock = {
  foo: {
    getMe: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('My name is NOT foo');
        }, 150);
      });
    },
  },
};

describe('## Test', () => {

  it('it should do something with mock (will fail without rewire plugin)', async() => {
    __Rewire__('dependency', dependencyMock);
    const spy = sinon.spy(dependencyMock.foo, 'getMe');
    const result = await me.bar2();

    sinon.assert.calledOnce(spy);
    expect(result).to.be.not.null;
    expect(result).to.be.equal('My name is NOT foo');
  });

  it('it should do something without mock (will not fail without rewire plugin)', async() => {
    const result = await dep.foo.getMe();

    expect(result).to.be.not.null;
    expect(result).to.be.equal('My name is foo');
  });

});