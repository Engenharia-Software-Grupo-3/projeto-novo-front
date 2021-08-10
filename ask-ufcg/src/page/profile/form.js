import React from 'react';

import { observer } from 'mobx-react';
import { Image, Button, Input, Form } from 'antd';

import LeftMenu from '../../components/LeftMenu/index.js';

import imagePic from '../../assets/profile.jpg';
import { ReactComponent as ChangeImageIcon } from '../../assets/changeImage.svg';

import './form.css';
import User from '../../domain/user.js';
import UserService from '../../services/user.js';
import ProfileFormStore from '../../stores/profile/form.js';

const { Search } = Input;

@observer
class ProfileForm extends React.Component {
  constructor() {
    super();
    this.store = new ProfileFormStore(User, UserService, 'User');
  }

  componentDidMount() {
    this.store.init();
  }

  onFinish = (values) => {
    console.log('Success:', values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    return (
      <div className='profile-page'>
        <LeftMenu />
        <div className='content'>
          <div className='profile-image-content'>
            <Image
              src={imagePic}
              alt={`Profile image of ...`}
              className='profile-image'
            />
            <Search
              placeholder="Link para nova imagem"
              allowClear
              enterButton="Enviar"
              size="large"
            />
          </div>
          <div className='profile-informations-change'>
            <Form onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
              <Form.Item>
                <Input
                  size='large'
                  placeholder='Nome'
                  className='input-info'
                  onChange={(value) =>
                    this.store.updateAttributeDecoratorKeyEventValue(
                      'firstName',
                      value
                    )
                  }
                />
              </Form.Item>
              <Form.Item>
                <Input
                  size='large'
                  placeholder='Sobrenome'
                  className='input-info'
                  onChange={(value) =>
                    this.store.updateAttributeDecoratorKeyEventValue(
                      'lastName',
                      value
                    )
                  }
                />
              </Form.Item>
              <Form.Item>
                <Input
                  size='large'
                  placeholder='Github'
                  className='input-info'
                  onChange={(value) =>
                    this.store.updateAttributeDecoratorKeyEventValue(
                      'linkGithub',
                      value
                    )
                  }
                />
              </Form.Item>
              <Form.Item>
                <Input
                  size='large'
                  placeholder='Linkedin'
                  className='input-info'
                  onChange={(value) =>
                    this.store.updateAttributeDecoratorKeyEventValue(
                      'linkLinkedin',
                      value
                    )
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  className='button-change button-change-extra-margin style-button'
                  type='primary'
                  htmlType='submit'
                >
                  Alterar Informações
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileForm;
