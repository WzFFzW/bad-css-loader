import { TAG } from './index';
import { bgRed } from 'chalk';

function BadCssPlugin() {}

BadCssPlugin.prototype.apply = function(complier) {
  complier.plugin('done', function(stats){
    const warnings = stats.compilation.warnings;
    const restWarnings = [];
    const badCssLoaderWarnings = [];
    warnings.map((warning) => {
      const { warning: _warning = {} } = warning;
      if ((_warning.tag && _warning.tag.indexOf(TAG) > -1) || warning.message.indexOf(TAG) > -1) {
        badCssLoaderWarnings.push(warning);
      } else {
        restWarnings.push(warning);
      }
    });
    stats.compilation.warnings = restWarnings;
    badCssLoaderWarnings.map((error) => {
      setTimeout(() => {console.log(bgRed('Warning', error.message))}, 0);
    });
  });
}

export default BadCssPlugin;