import { action, observable, runInAction, toJS } from 'mobx';
import AnswerService from '../../services/answer';
import Pergunta from '../../domain/pergunta';
import Answer from '../../domain/answer';

import {
  showErrorApiNotification,
  showNotification,
} from '../../utils/notification';
import DadosEstaticosService from '../../utils/dadosEstaticosService';

class VisualizacaoFormStore {
  @observable object = null;
  @observable loading = false;
  @observable answer = new Answer();
  @observable askTags;

  constructor(entity, service, entityName) {
    this.entity = entity;
    this.service = service;
    this.entityName = entityName;
    this.updateAttributeDecoratorKeyValue =
      this.updateAttributeDecoratorKeyValue.bind(this);
  }

  @action
  updateAttributeDecoratorKeyEventValue(key, event) {
    this.object[key] = event.target.value;
  }

  @action
  updateAttributeAnswerDecoratorKeyEventValue(key, event) {
    this.answer[key] = event.target.value;
  }

  @action
  updateAttributeDecoratorKeyValue(key, value) {
    this.object[key] = value;
  }

  @action
  updateAttributeDecoratorKeycheckedValue(key, event) {
    this.object[key] = event.target.checked;
  }

  @action
  init(id) {
    this.loading = true;
    this.service
      .getQuestion(id)
      .then((response) => {
        runInAction(`Get Question`, () => {
          this.object = new Pergunta(
            response && response.data ? response.data : undefined
          );
          const tags = this.object.tags ?? [];
          this.askTags = tags.map((item) => {
            let result = undefined;
            DadosEstaticosService.getLabelsDisciplinas().forEach(
              (disciplina) => {
                if (disciplina.value === item) {
                  result = disciplina.label;
                }
              }
            );
            return result;
          });
          this.loading = false;
        });
      })
      .catch((error) => {
        runInAction(`error on Save Question`, () => {
          this.loading = false;
          showErrorApiNotification(error);
        });
      });
  }

  @action
  addAnswer(token, user, callback) {
    this.loading = true;
    AnswerService.addAnswer(toJS(this.answer), user.id, this.object.id, token)
      .then((response) => {
        runInAction(`addAnswer`, () => {
          this.loading = false;
          this.object.answers.push(new Answer(response.data));
          showNotification('success', null, 'Resposta adicionado com sucesso!');
          if (callback) {
            callback();
          }
        });
      })
      .catch((error) => {
        runInAction(`error on Save Question`, () => {
          this.loading = false;
          showErrorApiNotification(error);
        });
      });
  }

  @action
  addLikeToQuestion(user, token) {
    if (user) {
      this.loading = true;
      if (this.checkIfUserIdInUsersLikedQuestion(user.id)) {
        this.service
          .removeLike(this.object.id, user.id, token)
          .then((response) => {
            runInAction(`add like`, () => {
              this.object = response.data;
              this.loading = false;
            });
          })
          .catch((error) => {
            runInAction(`error on add like`, () => {
              this.loading = false;
              showErrorApiNotification(error);
            });
          });
      } else {
        this.service
          .addLike(this.object.id, user.id, token)
          .then((response) => {
            runInAction(`add like`, () => {
              this.object = response.data;
              this.loading = false;
            });
          })
          .catch((error) => {
            runInAction(`error on add like`, () => {
              this.loading = false;
              showErrorApiNotification(error);
            });
          });
      }
    } else {
      showNotification(
        'error',
        null,
        'Por favor realize o login para poder dar like!'
      );
    }
  }

  @action
  addDislikeToQuestion(user, token) {
    if (user) {
      this.loading = true;

      if (this.checkIfUserIdInUsersDislikedQuestion(user.id)) {
        this.service
          .removeDislike(this.object.id, user.id, token)
          .then((response) => {
            runInAction(`add like`, () => {
              this.object = response.data;
              this.loading = false;
            });
          })
          .catch((error) => {
            runInAction(`error on add dislike`, () => {
              this.loading = false;
              showErrorApiNotification(error);
            });
          });
      } else {
        this.service
          .addDislike(this.object.id, user.id, token)
          .then((response) => {
            runInAction(`add like`, () => {
              this.object = response.data;
              this.loading = false;
            });
          })
          .catch((error) => {
            runInAction(`error on add dislike`, () => {
              this.loading = false;
              showErrorApiNotification(error);
            });
          });
      }
    } else {
      showNotification(
        'error',
        null,
        'Por favor realize o login para poder dar dislike!'
      );
    }
  }

  @action
  markAsSolved(token) {
    this.loading = true;
    this.service
      .updateQuestion(this.object, token)
      .then((response) => {
        runInAction(`Mark Solved`, () => {
          showNotification(
            'success',
            null,
            'Questão marcada como solucionada com sucesso!'
          );
          this.object = new Pergunta(response.data);
          this.loading = false;
        });
      })
      .catch((error) => {
        runInAction(`error on Mark Solved`, () => {
          this.loading = false;
          showErrorApiNotification(error);
        });
      });
  }

  checkIfUserIdInUsersLikedQuestion(userId) {
    return this.object.usersLike !== []
      ? this.object.usersLike.includes(userId)
      : false;
  }

  checkIfUserIdInUsersDislikedQuestion(userId) {
    return this.object.usersLike !== []
      ? this.object.usersDislike.includes(userId)
      : false;
  }
}

export default VisualizacaoFormStore;
