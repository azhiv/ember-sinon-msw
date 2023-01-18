// Copyright (c) 2023, RetailNext, Inc.
// This material contains trade secrets and confidential information of
// RetailNext, Inc.  Any use, reproduction, disclosure or dissemination
// is strictly prohibited without the explicit written permission
// of RetailNext, Inc.
// All rights reserved.

import sinon from 'sinon';
import * as QUnit from 'qunit';

let isUseFakeTimersPatched = false;
let clockToRestore: ReturnType<typeof sinon.useFakeTimers> | undefined;

function createSandbox() {
  if (!isUseFakeTimersPatched) {
    isUseFakeTimersPatched = true;
    patchUseFakeTimers(sinon);
  }
}

function restoreSandbox() {
  if (clockToRestore) {
    clockToRestore.restore();
    clockToRestore = undefined;
  }

  sinon.restore();
}

/**
 * Patches the `useFakeTimers` method in `sinon` to ensure
 * created clocks are tracked and subsequently restored after
 * each test is complete. Calling this more than once within a single
 * test will result in an error thrown.
 */
function patchUseFakeTimers(sandbox: typeof sinon) {
  const originalUseFakeTimers = sandbox.useFakeTimers;

  sandbox.useFakeTimers = function(...args: Parameters<typeof sinon.useFakeTimers>) {
    if (clockToRestore) {
      throw new Error(
        "You called sinon's useFakeTimers multiple times within the same test. This can result in unknown behavior.",
      );
    }

    const clock = originalUseFakeTimers?.apply(sandbox, args);

    clockToRestore = clock;

    return clock;
  };
}

export function setupSinon(testEnvironment: QUnit) {
  testEnvironment.testStart(createSandbox);
  testEnvironment.testDone(restoreSandbox);
}
