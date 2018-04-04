# es6-rewire-nyc

Small repo to simulate issue with istanbul/nyc and rewire

## With rewire/cross-env

Running the test using the default commands (that use rewire and cross-env) will generate an empty coverage report:
```
npm run test
```
this command will execute only the tests and both of them will pass
```
npm run test:cov
```

this will execute the previous `test` script but will add the coverage report, which will result empty

```
----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |        0 |        0 |        0 |        0 |                   |
----------|----------|----------|----------|----------|-------------------|
```

## Without rewire/cross-env

removing `cross-env NODE_ENV=test` from the test script will avoid to load rewire and will generate a correct coverage. The side effect is that the test that use the rewire will fail.
```
npm run test2
```
will run the script without `cross-env`, so babel will not load the rewire plugin and so one test will fail.
```
npm run test:cov2
```
this command will use the previous `test2` script and generate the coverage. In this case the coverage report will be generated correctly.

```
------------------|----------|----------|----------|----------|-------------------|
File              |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
------------------|----------|----------|----------|----------|-------------------|
All files         |    64.29 |      100 |    54.55 |    66.67 |                   |
 src              |       75 |      100 |       60 |    85.71 |                   |
  a-dependency.js |      100 |      100 |      100 |      100 |                   |
  a-module.js     |       60 |      100 |        0 |       75 |                 6 |
 tests            |       60 |      100 |       50 |       60 |                   |
  test.js         |       60 |      100 |       50 |       60 |... 23,24,26,27,28 |
------------------|----------|----------|----------|----------|-------------------|
```

but its not correct due the missing rewire plugin.

## babelrc (es2015)
```
{
  "presets": ["es2015"],
  "env": {
    "test": {
      "plugins": ["istanbul", "rewire"]
    }
  }
}
```
this is the babel configuration file used in the solution. Removing `rewire` plugin from the plugin collection will generate and empty coverage with `npm run test:cov` but not with `npm run test:cov2` (which is not using cross-env).

If I modify the babelrc in this way
```
{
  "presets": ["es2015"],
  "plugins": ["istanbul", "rewire"]
}
```

both `npm run test:cov` (with cross-env) and `npm run test:cov2` (without cross-env). Will generate an empty result.

If I remove both the plugins
```
{
  "presets": ["es2015"]
}
```
both command (with and without cross-env) will generate a coverage result (partial, since one test will fail)

Removing only `istanbul` from the plugin collection will generate a full coverage file and this would be the result (as expected)

```
------------------|----------|----------|----------|----------|-------------------|
File              |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
------------------|----------|----------|----------|----------|-------------------|
All files         |      100 |      100 |      100 |      100 |                   |
 src              |      100 |      100 |      100 |      100 |                   |
  a-dependency.js |      100 |      100 |      100 |      100 |                   |
  a-module.js     |      100 |      100 |      100 |      100 |                   |
 tests            |      100 |      100 |      100 |      100 |                   |
  test.js         |      100 |      100 |      100 |      100 |                   |
------------------|----------|----------|----------|----------|-------------------|
```

## babelrc (env)

After going across this issues around the previous `es2015` preset, I moved to the `env` one. Installing it with `npm install babel-preset-env --save-dev` then I've modified my babelrc in this way.

```
{
  "presets": [
    ["env", {
      "targets": {
        "node": "current"
      }
    }]
  ],
  "env": {
    "test": {
      "plugins": ["istanbul", "rewire"]
    }
  }
}
```

In this case `npm run test` works properly and `npm run test:cov` will generate a correct coverage report. And there will be no issue with cross-end or rewire.

## conclusion

Somehow both rewire and cross-env are creating issue if combined with babel when using the `es2015` preset. To generate the report with this preset apparenttly is sufficient to remove `istanbul` from the babel plugins and use only rewire (it will work well also with cross-env in this case).

I rather suggest to upgrate to the `env` preset and use the babel plugins as suggested (unless it create other issue to your project)

## env
```
> node --version
v9.4.0
> npm --version
5.6.0
>ver
Microsoft Windows [Version 10.0.16299.309]
```

Same behavior has been observed on MacOS
