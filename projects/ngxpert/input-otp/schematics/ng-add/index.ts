import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageToPackageJson } from './package-config';
import { getPackageVersionFromPackageJson } from './package-config';
export function ngAdd(): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (getPackageVersionFromPackageJson(host, '@ngxpert/input-otp') === null) {
      addPackageToPackageJson(host, '@ngxpert/input-otp', `~0.0.0-PLACEHOLDER`);
      context.addTask(new NodePackageInstallTask());
    }
  };
}
