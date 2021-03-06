'use strict';

const lab = exports.lab = require('lab').script();
const expect = require('chai').expect;

// prepare environment
const it = lab.it;
const describe = lab.describe;
const before = lab.beforeEach;
const after = lab.afterEach;

// get the server
const server = require('../server');
const db = require('../sequelize/models');

describe('Routes /stolenBikes', () => {
    before(() => { });
    after(async () => {
        await db.Bike.destroy({ where: {} });
        await db.PoliceOfficer.destroy({ where: {} });
        await db.PoliceDepartment.destroy({ where: {} });
    });
    describe('GET /stolenBikes', () => {
        it('return 200 HTTP status code', async () => {
            const options = { method: 'GET', url: '/stolenBikes' };
            const response = await server.inject(options);
            expect(response).to.have.property('statusCode', 200);
        });
    });
    describe('POST /stolenBikes', () => {
        it('return 201 HTTP status code', async () => {
            const options = { method: 'POST', url: '/stolenBikes', payload: { licenseNumber: 'IIA', ownerFullName: 'Syed Rizwan' } };
            const response = await server.inject(options);
            expect(response).to.have.property('statusCode', 201);
        });
    });

    describe('POST /stolenBikes/{bikeId}', () => {
        it('return 200 HTTP status code', async () => {
            let options = { method: 'POST', url: '/policeDepartments', payload: { name: 'NYPD' } };
            let response = await server.inject(options);
            let departmentId = response.result.dataValues.id;
            options = { method: 'POST', url: '/policeDepartments/' + departmentId + '/policeOfficers', payload: { name: 'John Officer' } };
            await server.inject(options);
            options = { method: 'POST', url: '/stolenBikes', payload: { licenseNumber: 'IIA', ownerFullName: 'Syed Rizwan' } };
            response = await server.inject(options);
            let bikeId = response.result.dataValues.id;
            options = { method: 'POST', url: '/stolenBikes/' + bikeId };
            response = await server.inject(options);
            expect(response).to.have.property('statusCode', 200);
        });
    });
});