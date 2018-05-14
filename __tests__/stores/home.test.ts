import '../TestContainer';
import { expect } from 'chai';
import { AppState } from '../../src/stores/app';
import { di } from 'jsmodules';

describe('stores/home.ts', function() {
    let app=di.Resolve("app");
    this.timeout(10000);
    before(async()=>{
       await app.use(di.Resolve("setting"))
            .use(di.Resolve("markets"))
            .use(di.Resolve("token"))
            .use(di.Resolve("user"))
            .use(di.Resolve("favorite"))
            .use(di.Resolve("chat"))
            .start();
    })
    it('home.loadNextPage', async()=> {
        expect(1).to.be.equals(1);
    });
});