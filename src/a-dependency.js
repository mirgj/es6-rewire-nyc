export default {
  foo: {
    getMe: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('My name is foo');
        }, 150);        
      });
    }
  }
}