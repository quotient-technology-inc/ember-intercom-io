import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { setProperties } from '@ember/object';
import { settled } from '@ember/test-helpers';

const mockConfig = {
  intercom: {
    userProperties: {
      nameProp: 'name',
      emailProp: 'email',
      createdAtProp: 'createdAt',
      customProp: 'custom'
    },
    appId: '1'
  }
};
let intercomStub;

module('Unit | Service | intercom', function(hooks) {

  setupTest(hooks);
  hooks.beforeEach(function() {
    this.owner.register('service:config', mockConfig, { instantiate: false });

    let service = this.owner.lookup('service:intercom');

    intercomStub = sinon.stub();

    this.subject().set('api', intercomStub);
    this.subject().set('config', mockConfig.intercom);
  }
});

test('it adds the correct user context to the boot config', function(assert) {
  let actualUser = {
    name: 'foo',
    email: 'foo@foo.com',
    createdAt: new Date(),
    custom: 'my-custom-property'
  };

  let service = this.subject();

  set(service.user, 'email', actualUser.email);
  set(service.user, 'name', actualUser.name);
  set(service.user, 'createdAt', actualUser.createdAt);
  set(service.user, 'custom', actualUser.custom);

  run(() => service.start({
    custom: actualUser.custom
  }));

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  let expectedBootConfig = {
    app_id: mockConfig.intercom.appId,
    name: actualUser.name,
    email: actualUser.email,
    createdAt: actualUser.createdAt,
    custom: actualUser.custom
  };
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

  assert.equal(!!intercomStub.calledOnce, true, 'it called the intercom module');
  sinon.assert.calledWith(intercomStub, 'boot', expectedBootConfig);
});
