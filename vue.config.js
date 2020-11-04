/**
 * User: CHT
 * Date: 2020/5/13
 * Time: 9:08
 */

module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    sourceMap: false
  },
  configureWebpack: {
    output: {
      filename: 'index.js',
      libraryTarget: 'umd',
      library: 'SuperFlow',
      umdNamedDefine: true
    }
  }
}
