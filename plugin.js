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
      if (_warning.tag && _warning.tag.indexOf(TAG) > -1) {
        badCssLoaderWarnings.push(warning);
      } else {
        restWarnings.push(warning);
      }
    });
    stats.compilation.warnings = restWarnings;
    badCssLoaderWarnings.map((error) => {
      console.log(bgRed('badCssLoader检测', error.details));
    });
  });
}

export default BadCssPlugin;