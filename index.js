import postcss from 'postcss';
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import plugin from './plugin';

export const BadCssLog = plugin;

const schema = {
  type: 'object',
  properties: {
    enable: {
      type: 'boolean',
    },
    include: {
      anyOf: [
        { type: "string" },
        { instanceof: "RegExp" }
      ],
    },
    exclude: {
      anyOf: [
        { type: "string" },
        { instanceof: "RegExp" }
      ],
    },
  },
};

export const TAG = '@badCssLoader@';

export default function loader(source, map, meta) {
  const options = getOptions(this) || {};
  const path = this.resourcePath;
  validateOptions(schema, options);
  const { enable = true, include = '', exclude = '' } = options;
  if (
    !enable
      || (exclude && new RegExp(exclude).test(path))
      || (include && !new RegExp(include).test(path))
  ) {
    this.callback(null, source, map, meta);
    return;
  }
  let astRoot;
  // 如果postcss中已经编译了过css ast了，就复用
  if (meta) {
    const { ast } = meta;
    astRoot = ast.root;
  } else {
    astRoot = postcss.parse(source || '', { from: this.resourcePath });
  }
  const nodes = astRoot.nodes.filter((node) => node.type === 'rule');
  for (let i = 0; i < nodes.length; i++) {
    const { selector = '' } = nodes[i];
    const selectors = selector.split(',');
    let badSelector = '';
    const isHasBadCssSelector = selectors.some((selector) => {
      const result = /(^(\*|\w+)$)/.test(selector);
      if (result) {
        badSelector = selector;
      }
      return result;
    });
    if (isHasBadCssSelector) {
      const errorMsg = `${TAG}:${path}有入侵式css,选择器为${badSelector}`;
      const error = new Error(errorMsg);
      error.tag = TAG;
      this.emitWarning(error);
      break;
    }
  }
  this.callback(null, source, map, meta);
  return;
};