import { info } from '../../src/resolvers/Query'

describe('#info', () => {
  test('it runs something', () => {
    console.log(info(1, 1, 1, 1));
    const actual = 1 + 1;
    expect(actual).toEqual(2);
  });
});