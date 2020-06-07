import compiler from './webpack.js';

test('webpack find bad css', async () => {
  expect(async () => await compiler('test.css')).not.toThrow();
});