module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (commit) => commit?.startsWith?.('release'),
    (commit) => commit?.startsWith?.('auto-generated-by-ci'),
  ],
};
