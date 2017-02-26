// Hey!
//
// This does a few things:
//
// - converts markdown to html
// - replaces all internal github markdown links to work for
//   the website, internal document links, internal package links,
//   and cross-package links (react-router-dom linking to react-router)
// - highlights the code

const markdownIt = require('markdown-it')
const Prism = require('prismjs')
const cheerio = require('cheerio')
const path = require('path')
const slug = require('slug')

const routerDelegationClassName = 'internal-link'

// charmap gets rid of weird <Route> -> lessRoutegreater
const slugify = (s) => slug(s, { charmap: {} })

const aliases = {
  'js': 'jsx',
  'html': 'markup'
}

const highlight = (str, lang) => {
  if (!lang) {
    return str
  } else {
    lang = aliases[lang] || lang
    require(`prismjs/components/prism-${lang}.js`)
    if (Prism.languages[lang]) {
      return Prism.highlight(str, Prism.languages[lang])
    } else {
      return str
    }
  }
}

const extractHeaders = ($, level = 'h2') => (
  $(level).map((n, e) => {
    const $e = $(e)
    const text = $e.text()
    return {
      text: text,
      slug: slugify(text)
    }
  }).get()
)

const envMap = {
  'react-router': 'core',
  'react-router-native': 'native',
  'react-router-dom': 'web'
}

const correctLinks = ($, moduleSlug, environment) => {
  $('a[href]').each((i, e) => {
    const $e = $(e)
    const href = $e.attr('href')

    // this assumes the docs/ folder is not ever nested in any package
    const isSamePage = href.startsWith('#')
    const isCrossPackage = href.startsWith('../../')
    const isSiblingDoc = !isCrossPackage && !href.startsWith('/') && !href.match(/http[s]?:/)

    // from github: href="#render-func"
    // to website:  href="/web/api/Route/render-func"
    if (isSamePage) {
      $e.attr('href', `/${environment}/api/${moduleSlug}/${href.substr(1)}`)
    }

    // from github: href="context.router.md"
    // to website:  href="/core/api/context.router"
    // NOTE: Does not handle "context.router.md#foo"
    else if (isSiblingDoc) {
      const doc = href.replace(/\.md$/, '')
      $e.attr('href', `/${environment}/api/${doc}`)
    }

    // from github: href="../../react-router/Route.md"
    // to website:  href="/core/api/Router"
    else if (isCrossPackage) {
      const split = href.split('/')
      const env = envMap[split[2]]
      const doc = split[4].replace(/\.md$/, '')
      $e.attr('href', `/${env}/api/${doc}`)
    }

    if (isSamePage || isSiblingDoc || isCrossPackage) {
      $e.addClass(routerDelegationClassName)
    }
  })
}

const makeHeaderLinks = ($, moduleSlug, environment) => {
  // can abstract these two things a bit, but it's late.
  $('h1').each((i, e) => {
    const $e = $(e)
    $e.attr('id', moduleSlug)
    const children = $e.html()
    const link = $(`<a href="/${environment}/api/${moduleSlug}" class="${routerDelegationClassName}"/>`)
    link.html(children)
    $e.empty().append(link)
  })

  $('h2').each((i, e) => {
    const $e = $(e)
    const slug = slugify($e.text())
    $e.attr('id', `${moduleSlug}-${slug}`)
    const children = $e.html()
    const link = $(`<a href="/${environment}/api/${moduleSlug}/${slug}" class="${routerDelegationClassName}"/>`)
    link.html(children)
    $e.empty().append(link)
  })
}

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight
})

module.exports = function (content) {
  this.cacheable()
  const markup = md.render(content)
  const $markup = cheerio.load(markup)
  const title = extractHeaders($markup, 'h1')[0]
  correctLinks($markup, title.slug, this.data.environment)
  makeHeaderLinks($markup, title.slug, this.data.environment)
  const headers = extractHeaders($markup, 'h2')
  this.value = {
    markup: $markup.html(),
    headers: headers,
    title: title
  }
  return `module.exports = ${JSON.stringify(this.value)}`
}

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  // figures out the environment by either parsing off a query
  // i.e. '../../react-router/docs/Route.md?web'
  // so we can import Route.md and render at "/web/api/Route.md"
  // if there is no query then it figures it out based on the
  // require path
  const envMatch = remainingRequest.match(/\?(.+)$/)
  data.environment = envMatch ?
    envMatch[1] : envMap[remainingRequest.split('/').reverse()[2]]
}
