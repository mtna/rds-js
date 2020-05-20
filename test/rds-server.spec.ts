import { RdsServer } from '../src/rds-server';

// TODO write some tests :)
describe('RdsServer', () => {
  it('Can instantiate', () => {
    expect(new RdsServer('')).toBeInstanceOf(RdsServer);
  });
});
