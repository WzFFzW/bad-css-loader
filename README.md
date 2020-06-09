# bad-css-loader
查找第三方css入侵式样式的webpack loader

你是否遇到过下面这种情况
```css
// 第三方组件库中，css入侵
* {
  margin: 0;
  box-sizing: border-box;
}
body {
  overflow: hidden;
}
....
```

这个loader就是为了查找css中，是否存在全局元素样式有影响的css选择器。找到它，然后进行告警

> 不建议在构建时使用，可以在开发阶段添加

# 使用方法
```js
··· // webpack config
{
  test: /\.css$/,
  use: [
    ...
    'bad-css-loader',
    ...
  ],
}
···
```

## TODO
- [ ] 1. 增加一个更多入侵式css选择器的正则匹配
- [ ] 2. 目前只检测了最外层级的css选择器，是否需要多验证全部层级（考虑中）
- [ ] 3. 只验证过css。less，scss需要在验证

# 开发
> npm run dev

# 构建
> npm run build

# 调试
```bash
cd /path/bad-css-loader
npm link
cd /path/project
npm link bad-css-loader
```