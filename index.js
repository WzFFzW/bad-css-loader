import postcss from 'postcss';

/**
 * 
 * TODO 
 * 1. 增加一个更多入侵式css选择器的正则匹配
 * 2. 目前只检测了最外层级的css选择器，是否需要多验证全部层级（带考虑）
 * 3. 只验证过css。less，scss需要在验证
 */
export default function loader(source, map, meta) {
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
      const errorMsg = `${this.resourcePath}有入侵式css,选择器为${badSelector}`;
      this.emitWarning(errorMsg);
      break;
    }
  }
  this.callback(null, source, map, meta);
  return;
};