import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { createInTree } from '../../../utils/tree';
import { getParsedDomain } from '../../../utils/domain';

export const addMockFile = (application: string, domain: string): Rule => {
  return (tree: Tree, _context: SchematicContext) => {
    const librarySourceRoot = `libs/${application}/${domain}/util/src`;
    const mockFilePath = `lib/model/${getParsedDomain(domain)}.mock`;
    addIndexFile(tree, librarySourceRoot, mockFilePath);
    addEmptyMockFile(tree, librarySourceRoot, mockFilePath);
    return tree;
  };
};

const addEmptyMockFile = (
  tree: Tree,
  librarySourceRoot: string,
  mockFilePath: string
): void =>
  createInTree(
    tree,
    `${librarySourceRoot}/${mockFilePath}.ts`,
    'export const mock = {};'
  );

const addIndexFile = (
  tree: Tree,
  librarySourceRoot: string,
  mockFilePath: string
): void =>
  createInTree(
    tree,
    `${librarySourceRoot}/testing.ts`,
    `export * from './${mockFilePath}';`
  );
