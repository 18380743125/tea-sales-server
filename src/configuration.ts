import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as _ from 'lodash';

/**
 * @description 加载 yaml 配置文件
 * @author tl-bright
 */
export function loadYaml(name: string) {
  const pathname = path.join(__dirname, '../config', name + '.yml');
  return yaml.load(fs.readFileSync(pathname, 'utf8'));
}

export default () => {
  const defaultConfig = loadYaml('default');
  const envConfig = loadYaml(process.env.NODE_ENV || 'development');
  return _.merge(defaultConfig, envConfig);
};
