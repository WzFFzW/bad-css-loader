import compiler from './test/webpack';
import path from 'path';

compiler(path.resolve(__dirname, './test/test.less')).catch((error) => { console.error(error) });
compiler(path.resolve(__dirname, './test/test.scss')).catch((error) => { console.error(error) });
compiler(path.resolve(__dirname, './test/test.css')).catch((error) => { console.error(error) });
