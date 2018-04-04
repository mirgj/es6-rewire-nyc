import * as me from './src/a-module';

(async() =>  {
	const res = await me.bar2();
	console.log(res);	
})();