import dependency from './a-dependency';

const foo = () => dependency.foo;

const bar2 = async () => {
  return await foo().getMe();
};

export {
  bar2
};