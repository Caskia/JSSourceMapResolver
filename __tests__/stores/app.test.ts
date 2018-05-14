
import { expect } from 'chai';
//const expect = require('chai').expect;
import AppState, { AppStatus } from '../../src/stores/app';
describe('stores/app.ts', function() {
    it('app.start', async()=> {
        var app=new AppState();
        await app.start();
        expect(app.status).to.be.equal(AppStatus.ready);
    });
});