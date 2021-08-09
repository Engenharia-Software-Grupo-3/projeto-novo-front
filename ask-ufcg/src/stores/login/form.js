import { action, observable } from 'mobx';
import User from '../../domain/user';

class LoginFormStore {
  @observable object = null;
  @observable loading = false;

  constructor(entity, service, entityName) {
    this.entity = entity;
    this.service = service;
    this.entityName = entityName;
    this.updateAttributeDecoratorKeyValue =
      this.updateAttributeDecoratorKeyValue.bind(this);
  }

  @action
  updateAttributeDecoratorKeyEventValue(key, event) {
    console.log(event);
    this.object[key] = event.target.value;
  }

  @action
  updateAttributeDecoratorKeyValue(key, value) {
    this.object[key] = value;
  }

  @action
  init(id, callback) {
    this.loading = true;
    this.object = new User();
    if (callback) {
      callback();
    }
  }
}

export default LoginFormStore;
