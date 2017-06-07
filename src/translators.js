import curry from 'lodash.curry'

export const tc = curry((translate, interpolate, message, scope = {}) => {
  return interpolate(translate(message), scope)
})

export const tcn = curry((translate, interpolate, one, other, count, scope = {}) => {
  return interpolate(translate(one, other, count), scope)
})

export const tcp = curry((translate, interpolate, context, message, scope = {}) => {
  return interpolate(translate(context, message), scope)
})

export const tcnp = curry((translate, interpolate, context, one, other, count, scope = {}) => {
  return interpolate(translate(context, one, other, count), scope)
})
