import React, { Component, PropTypes } from 'react'

let delegate = (router) => {
  document.body.addEventListener('click', (e) => {
    let node = e.target
    let link = null
    while (node) {
      if (node.className.match(/internal-link/)) {
        e.preventDefault()
        const href = node.getAttribute('href')
        router.push(href)
        break;
      }
      node = node.parentNode
    }
  })
  delegate = () => {}
}

class DelegateMarkdownLinks extends Component {

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount() {
    delegate(this.context.router)
  }

  render() {
    return this.props.children
  }
}

export default DelegateMarkdownLinks
