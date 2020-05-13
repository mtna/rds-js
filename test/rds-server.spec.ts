import { RdsServer } from '../src/rds-server';

// TODO write some tests :)
describe('RdsServer', () => {
  it('Can get an instance after initialized', () => {
    RdsServer.init();
    expect(RdsServer.getInstance()).toBeInstanceOf(RdsServer);
  });
});
