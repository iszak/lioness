import React, { Component } from 'react'
import PropTypes from 'prop-types'

import getGettextInstance from '../getGettextInstance.js'
import * as contextTypes from '../contextTypes.js'
import { tc, tcn, tcp, tcnp } from '../translators.js'
import { interpolateToElement } from '../interpolateComponents.js'

/**
 * Localization context provider
 */
class LionessProvider extends Component {

  // Prop types
  static propTypes = {
    messages: PropTypes.object.isRequired,
    interpolate: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    interpolate: interpolateToElement,
  }

  // Child context types
  static childContextTypes = {
    ...contextTypes,
  }

  constructor(props) {
    super(props)

    this.gt = getGettextInstance(props.messages, props.locale)
  }

  /**
   * Translator functions are curried, so we return a set of functions
   * which all have been given a translation function.
   */
  getChildContext() {
    const identity = x => x

    return {
      locale: this.props.locale,
      interpolate: this.props.interpolate,
      t: tc(this.gt.gettext.bind(this.gt), identity),
      tn: tcn(this.gt.ngettext.bind(this.gt), identity),
      tp: tcp(this.gt.pgettext.bind(this.gt), identity),
      tnp: tcnp(this.gt.npgettext.bind(this.gt), identity),
      tc: tc(this.gt.gettext.bind(this.gt)),
      tcn: tcn(this.gt.ngettext.bind(this.gt)),
      tcp: tcp(this.gt.pgettext.bind(this.gt)),
      tcnp: tcnp(this.gt.npgettext.bind(this.gt)),
    }
  }

  /**
   * Set the locale when receiving new props
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      this.gt.setLocale(nextProps.locale)
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

export default LionessProvider
