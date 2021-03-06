import { isString, isFunction } from '~'
import { isWidget, isVNode, isThunk, isHook } from './types'

class VNode {
  constructor (tagName, properties, children, key, namespace) {
    this.tagName = tagName || 'DIV'
    this.properties = properties || {}
    this.children = children || []
    this.key = key || null
    this.namespace = (isString(namespace)) ? namespace : null
    let count = this.children.length || 0
    let descendants = 0
    let hasWidgets = false
    let hasThunks = false
    let descendantHooks = false
    let hooks
    for (let propName in properties) {
      if (properties.hasOwnProperty(propName)) {
        let property = properties[propName]
        if (isHook(property) && property.unhook) {
          if (!hooks) {
            hooks = {}
          }
          hooks[propName] = property
        }
      }
    }
    if (count) {
      this.children.forEach((child) => {
        if (isVNode(child)) {
          descendants += child.count || 0
          if (!hasWidgets && child.hasWidgets) {
            hasWidgets = true
          }
          if (!hasThunks && child.hasThunks) {
            hasThunks = true
          }
          if (!descendantHooks && (child.hooks || child.descendantHooks)) {
            descendantHooks = true
          }
        } else if (!hasWidgets && isWidget(child)) {
          if (isFunction(child.destroy)) {
            hasWidgets = true
          }
        } else if (!hasThunks && isThunk(child)) {
          hasThunks = true
        }
      })
    }
    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
  }
}

VNode.prototype.type = 'VirtualNode'

export default VNode