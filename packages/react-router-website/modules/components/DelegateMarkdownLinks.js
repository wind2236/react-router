import React, { Component, PropTypes } from 'react'

let delegate = (router) => {
  console.log(0)
  document.body.addEventListener('click', (e) => {
    console.log(1)
    if (e.target.matches('a.internal-link')) {
      console.log(2)
      e.preventDefault()
      const href = e.target.getAttribute('href')
      setTimeout(() => {
        router.push(href)
      }, 50)
    }
  }, false)
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
