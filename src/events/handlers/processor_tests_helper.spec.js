/**
 * Common handler for mockup of shared logger, it is imported by tests
 * that use logger
 */

import mockery from 'mockery';

let modname = '';
export default function(modulename) {
  modname = modulename;
}

before(() => {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true,
  });

  mockery.registerAllowable(modname);
  mockery.registerMock('../../common/logger', {
    log: () => {
    },
  });
});
