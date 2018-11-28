import * as requireResolve from 'resolve-pkg';
import * as semver from 'semver';

export class BabelTransform {
  config: any;
  options: any;
  babel: any;

  constructor (config = {}, options = {}) {
    this.config = {
      sourceMaps: 'both',
      ...config,
    };

    this.options = {
      servicePath       : '',
      skipOnError       : false, // When false, errors will halt execution
      logErrors         : true,
      normalizeBabelExt : false,
      ...options,
    };

    // eslint-disable-next-line
    this.babel = require(
      requireResolve(this.options.babelCore, { cwd: this.options.servicePath }),
    );
  }

  run ({ code, map, relPath }) {
    let result = { code, map, relPath };

    try {
      let transformed = null;
      if (semver.gt(this.babel.version, '7.0.0')) {
        transformed = this.babel.transform(code, {
          ...this.config,
          sourceFileName  : relPath,
        });
      } else {
        transformed = this.babel.transform(code, {
          ...this.config,
          sourceFileName  : relPath,
          sourceMapTarget : relPath,
        });
      }

      result = {
        ...result,
        ...transformed,
        relPath: this.options.normalizeBabelExt
          ? relPath.replace(/\.[^.]+$/, '.js')
          : relPath,
      };
    } catch (err) {
      // tslint:disable-next-line:no-console
      if (this.options.logErrors) { console.error(err); } // eslint-disable-line
      if (!this.options.skipOnError) { throw err; }
    }

    return result;
  }
}
