import {
  runNxCommandAsync,
  readJson,
  checkFilesExist,
} from '@nrwl/nx-plugin/testing';

describe('domain', () => {
  describe('removeCypressProject', () => {
    it('should remove e2e project for domain and keep cypress when storybook project also exists', async (done) => {
      const application = 'test-application';
      const domain = 'jest-junit-reporter';
      await runNxCommandAsync(
        `generate @srleecode/domain:removeCypressProject --application ${application} --domain ${domain} --projectType=e2e`
      );

      const nxJson = readJson('nx.json');
      const workspaceJson = readJson('workspace.json');
      const projectName = `e2e-${application}-${domain}`;
      expect(nxJson.projects[projectName]).not.toBeDefined();
      expect(workspaceJson.projects[projectName]).not.toBeDefined();
      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/.cypress/src/support/index.ts`
        )
      ).not.toThrow();
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/.cypress/cypress.json`)
      ).toThrow();
      done();
    }, 120000);

    it('should remove storybook project and cypress folder for domain when only storybook cypress project', async (done) => {
      const application = 'test-application';
      const domain = 'storybook-domain';
      await runNxCommandAsync(
        `generate @srleecode/domain:removeCypressProject --application ${application} --domain ${domain} --projectType=storybook`
      );

      const nxJson = readJson('nx.json');
      const workspaceJson = readJson('workspace.json');
      const projectName = `e2e-${application}-${domain}`;
      expect(nxJson.projects[projectName]).not.toBeDefined();
      expect(workspaceJson.projects[projectName]).not.toBeDefined();
      expect(() =>
        checkFilesExist(`libs/${application}/${domain}/.cypress/config.js`)
      ).toThrow();
      expect(() =>
        checkFilesExist(
          `libs/${application}/${domain}/.cypress/support/index.ts`
        )
      ).toThrow();
      done();
    }, 120000);
  });

  it('should remove cypress when last cypress project type is being removed', async (done) => {
    const application = 'test-application';
    const domain = 'jest-junit-reporter';
    await runNxCommandAsync(
      `generate @srleecode/domain:removeCypressProject --application ${application} --domain ${domain} --projectType=storybook`
    );

    const nxJson = readJson('nx.json');
    const tsConfig = readJson('tsconfig.base.json');
    const workspaceJson = readJson('workspace.json');
    const projectName = `e2e-${application}-${domain}`;
    expect(nxJson.projects[projectName]).not.toBeDefined();
    expect(workspaceJson.projects[projectName]).not.toBeDefined();
    expect(() =>
      checkFilesExist(
        `libs/${application}/${domain}/.cypress/src/support/index.ts`
      )
    ).toThrow();
    expect(
      tsConfig.compilerOptions.paths[`@cypress/${application}/${domain}`]
    ).not.toBeDefined();
    done();
  }, 120000);
});
