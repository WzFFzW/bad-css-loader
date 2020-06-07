import postcss from 'postcss';

/**
 * 
 * TODO 
 * 1. 增加一个更多入侵式css选择器的正则匹配
 * 2. 目前只检测了最外层级的css选择器，是否需要多验证全部层级（带考虑）
 * 3. 只验证过css。less，scss需要在验证
 */
export default function loader(source, map, meta) {
  let content = source;
  // 如果postcss中已经编译了过css ast了，就复用
  if (meta) {
    const { ast } = meta;

    if (
      ast &&
      ast.type === 'postcss' &&
      satisfies(ast.version, `^${postcssPkg.version}`)
    ) {
      content = ast.root;
    }
  }
  postcss().process(content, { from: this.resourcePath }).then((result) => {
    const nodes = result.root.nodes;
    // 只遍历了第一层级，第二层级默认其有自己css的作用域
    let badSelector = '';
    for (let i = 0; i < nodes.length; i++) {
      const { selectors } = nodes[i];
      const isHasBadCssSelector = selectors.some((selector) => {
        const result = /(^(\*|\w+)$)/.test(selector);
        if (result) {
          badSelector = selector;
        }
        return result;
      });
      if (isHasBadCssSelector) {
        const errorMsg = `${this.resourcePath}有入侵式css   ${badSelector}`;
        this.emitWarning(new Error(errorMsg));
        console.log(errorMsg);
        break;
      }
    }
  });
  return source;
};