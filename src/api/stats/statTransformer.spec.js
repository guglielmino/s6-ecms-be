'use strict';

import chai from 'chai';
import sinon from 'sinon';

import { transformStat } from './statTransformer';

chai.should();
const expect = chai.expect;

describe('stat transformer', () => {

    it('should transform stat in response object', () => {
        let res = transformStat({
            _id: null,
            Current: 20.46,
            Power: 0
        });

        res.current.should.be.eq(20.46);
        res.power.should.be.eq(0);
        Object.keys(res).length.should.be.eq(2);
    });
});