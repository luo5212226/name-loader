const parseVue = require('@vue/compiler-sfc').parse;
const { parse } = require('@babel/parser');
const { getOptions } = require('loader-utils');
const t = require('@babel/types');
const generator = require('@babel/generator');
const traverse = require("@babel/traverse");
const convertPath = require('path');

function nameLoader(content) {
  // 获取文件路径参数
  let params = new URLSearchParams(this.resource);
  // 自定义文件name
  const componentName = params.get('component')
  // type值有script|styles|template，只对type为script部分做转化
  if (params.get('type') === 'script') {
    // 通过getOptions获取配置loader时传入的options参数，todo
    const options = getOptions(this) || {};
    // script原内容
    const script = parseVue(content).descriptor.script.loc.source;
    // 转化成ast
    const ast = parse(script, {
      sourceType: 'module'
    });
    const resourcePath = this.resourcePath;
    // 遍历
    traverse.default(ast, {
      ExportDefaultDeclaration(path) {
        // 是否有name字段
        const node = path.node.declaration.properties.find(item => item.key.name === 'name');
        if (!node) {
          // 是否ast树return中第一个property类型的节点
          let isFirst = true;
          // 遍历当前ast节点，找到第一个对象
          path.traverse({
            ObjectExpression(childPath) {
              if (isFirst) {
                // 遍历第一个对象，并插入name属性
                childPath.traverse({
                  enter(childPath) {
                    if (isFirst) {
                      const basename = componentName ? componentName : convertPath.basename(resourcePath);
                      childPath.insertBefore(t.objectProperty(t.identifier('name'), t.stringLiteral(basename.split('.')[0])));
                      isFirst = false;
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
    // ast2code
    const { code } = generator.default(ast);
    // 替换没有name字段的原内容
    const newContent = content.replace(script, code);
    return newContent;
  } else {
    return content;
  }
}

export default nameLoader;