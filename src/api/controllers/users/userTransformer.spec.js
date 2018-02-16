import chai from 'chai';
import usersTransformer from './usersTransformer';

chai.should();

describe('user transformer', () => {
  it('should transform auth0 user object to s6 User', () => {
    const mockUser = {
      userId: 'auth0|5978df006fcc61699ce9ba0f',
      app_metadata: {
        roles: [
          'admin',
        ],
        gateways: [
          'gw2',
        ],
      },
      created_at: new Date(),
      email: 'alessiaplr5@gmail.com',
      gateways: [
        'gw2',
      ],
      global_client_id: '3BrJytqsO57D0svQQDKextQnJ_IzMgiA',
      identities: [
        {
          user_id: '5978df006fcc61699ce9ba0f',
          provider: 'auth0',
          connection: 'Username-Password-Authentication',
        },
      ],
      name: 'test@mail.com',
      nickname: 'testuser',
      picture: 'https://s.gravatar.com/avatar/8a9aca2f0a4dcd8dc10c5e2dda9cdf4e?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fal.png',
      roles: [
        'admin',
      ],
      updated_at: new Date(),
      user_id: 'auth0|5978df006fcc61699ce9ba0f',
    };

    const result = usersTransformer(mockUser);
  console.log(result);
    Object.keys(result).length.should.be.eq(7);
    result.userId.should.be.eq('auth0|5978df006fcc61699ce9ba0f');
    result.name.should.be.eq('test@mail.com')
    result.email.should.be.eq('alessiaplr5@gmail.com');
    result.gateways.should.be.deep.eq(['gw2']);
    result.roles.should.be.deep.eq(['admin']);
    result.created.should.be.eq(mockUser.created_at);
  });
});
