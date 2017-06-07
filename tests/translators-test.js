/* eslint-env mocha */

import { expect } from 'chai'
import { spy, stub } from 'sinon'

import { t, tp, tn, tnp, tc, tcp, tcn, tcnp } from '../src/translators.js'

describe('translators', () => {
  let interpolate
  let translate
  const scope = { name: 'francesca' }

  beforeEach(() => {
    interpolate = spy()
    translate = stub().returns('groundhog day')
  })

  describe('tc()', () => {
    it('interpolates the translated string with the provided scope', () => {
      tc(translate, interpolate,  'wow', scope)
      expect(interpolate.calledWithMatch('groundhog day', scope)).to.equal(true)
    })
  })

  describe('tcn()', () => {
    it('interpolates the translated string with the provided scope', () => {
      tcn(translate, interpolate,  'wow', 'wows', 12, scope)
      expect(interpolate.calledWithMatch('groundhog day', scope)).to.equal(true)
    })
  })

  describe('tcp()', () => {
    it('interpolates the translated string with the provided scope', () => {
      tcp(translate, interpolate,  'context', 'wow', scope)
      expect(interpolate.calledWithMatch('groundhog day', scope)).to.equal(true)
    })
  })

  describe('tcnp()', () => {
    it('interpolates the translated string with the provided scope', () => {
      tcnp(translate, interpolate,  'context', 'wow', 'wows', 1, scope)
      expect(interpolate.calledWithMatch('groundhog day', scope)).to.equal(true)
    })
  })
})
