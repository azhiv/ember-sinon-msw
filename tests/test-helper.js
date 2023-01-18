import Application from 'ember-sinon-msw/app';
import config from 'ember-sinon-msw/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { setupSinon } from './helpers/sinon';

setApplication(Application.create(config.APP));
setupSinon(QUnit);
setup(QUnit.assert);

start();
