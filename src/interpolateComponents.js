import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import curry from 'lodash.curry'

/*

<div>
  {t('Check the {{ author }} for more articles', {
    author: <Link to={`/authors/${author.id}`}>{author.name}</Link>
  })}
</div>

*/

const variableRegex = /(\{\{\s.+?(?=\s\}\})\s\}\})/g

/**
 * Returns whether a string is a template variable
 */
export function isTemplateVariable(str) {
  return new RegExp(variableRegex).test(str)
}

export const interpolateToString = curry(interpolateComponents)(
  (key, part) => part,
  (key, part) => part,
  (key, part) => part,
  (key, element, children) => renderToStaticMarkup(React.cloneElement(element, { key }, children || null)),
  (parts) => parts.join('')
)

export const interpolateToElement = curry(interpolateComponents)(
  (key, part) => React.createElement('span', { key }, part),
  (key, part) => React.createElement('span', { key }, part),
  (key, part) => React.createElement('span', { key }, part),
  (key, element, children) => React.cloneElement(element, { key }, children || null),
  (parts) => <span>{parts}</span>
)

/**
 * Interpolates a string, replacing template variables with values
 * provided in the scope.
 *
 * Besides replacing variables with
 */
export function interpolateComponents(
  stringReplacement,
  noMatchScopeVariableReplacement,
  stringScopeVariableReplacement,
  elementScopeVariableReplacement,
  combiner,
  str,
  scope = {}
) {
  if (!str) {
    return str
  }

  // Split string into array with regular text and variables split
  // into separate segments, like ['This is a ', '{{ thing }}', '!']
  const parts = str.split(new RegExp(variableRegex)).filter(x => x)

  // If the only thing we have is a single regular string, just return it as is
  if (parts.length === 1 && isTemplateVariable(parts[0]) === false) {
    return str
  }

  const interpolatedParts = parts.map((part, i) => {
    const key = `${part}_${i}`

    // Not a template variable, return simple <span> with a string
    if (isTemplateVariable(part) === false) {
      return stringReplacement(key, parts[i])
    }

    let keyName = part.replace(/^\{\{\s/, '').replace(/\s\}\}$/, '')
    let [scopeKey, scopeChildren] = keyName.split(/:(.+)/)

    // No matching scope replacement, return raw string
    if (scope[scopeKey] === undefined) {
      return noMatchScopeVariableReplacement(key, parts[i])
    }

    const replacement = scope[scopeKey]

    // If the interpolated scope variable is not a React element, render
    // it as a string inside a <span>
    if (React.isValidElement(replacement) === false) {
      return stringScopeVariableReplacement(key, String(replacement))
    }

    return elementScopeVariableReplacement(key, replacement, scopeChildren || null)
  })

  return interpolatedParts.length > 1
    ? combiner(interpolatedParts)
    : interpolatedParts[0]
}
