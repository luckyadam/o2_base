class HtmlHook {
  constructor (value) {
    this.value = value
  }

  hook (node) {
    node.innerHTML = this.value.__html || ''
  }
}

export default HtmlHook