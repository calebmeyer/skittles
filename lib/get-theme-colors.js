'use babel'

import Color from 'color';

/*
  This function gets the current theme's colors. There are some assumptions made:
  1: Themes will use different colors for the syntax classes below, since
    they're different when generated by the package generator

  Returns a unique array of hex colors, like
  ["#85b1e0", "#dda2f6", "#a571f4", "#9aefea", "#93ddfb", "#f5faff", "#7e7edd"]
*/
export function getThemeColors() {
  let selectors = [
    ['syntax--variable'], // red
    ['syntax--meta', 'syntax--require'], // blue
    ['syntax--string'], // green
    ['syntax--constant'], // orange
    ['syntax--storage'], // purple
    ['syntax--support', 'syntax--function'], // cyan
    ['syntax--support', 'syntax--class'], // light orange (aka yellow)
    ['syntax--entity', 'syntax--name', 'syntax--function'], // monokai green
    ['syntax--variable', 'syntax--parameter', 'syntax--function'], // monokai orange

  ]
  let grammar = atom.grammars.grammarForScopeName('source.julia')

  let styled = {}
  let colors = []
  let div = document.createElement('div')
  div.classList.add('editor', 'editor-colors', 'julia-syntax-color-selector')

  for (let style in selectors) {
    let child = document.createElement('span')
    child.innerText = 'foo'
    child.classList.add(...selectors[style])
    div.appendChild(child)
    styled[style] = child
  }

  document.body.appendChild(div)
  // wait till rendered?
  for (let style in selectors) {
    try {
      let rgb = window.getComputedStyle(styled[style])['color']

      colors.push(Color(rgb))
    } catch (e) {
      console.error(e)
    }
  }
  document.body.removeChild(div)

  // color[0] is the hue part
  // uncomment to sort by hue
  // TODO: Make this a config item
  // colors.sort((a, b) => (a.hsl().color[0] - b.hsl().color[0]))

  colors = colors.map(color => (convertRGBToHex(color.string())))

  return [...new Set(colors)]
}

/*
 * Converts the given rgb or rgba color code to six digit hex
 * rgb - a color of the form "rgb(0, 128, 255)" or "rgba(23, 42, 56, 200)"
 *
 * Returns the color as a hex color code like "#0077FF"
 */
function convertRGBToHex(rgb) {
  if (rgb.search("rgb") == -1) {
    return rgb
  } else {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/)
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }
}
