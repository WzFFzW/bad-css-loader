import compiler from './test/webpack';
import path from 'path';

compiler(path.resolve(__dirname, './test/test.css'));
