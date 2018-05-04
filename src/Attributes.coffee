Types =
  Attribute: 'attribute'
  Property: 'property'

export default {
  href:
    type: Types.Attribute
  style:
    type: Types.Property
    alias: 'style.cssText'
  for:
    type: Types.Property
    alias: 'htmlFor'
  class:
    type: Types.Property
    alias: 'className'
  # React compat
  spellCheck:
    type: Types.Property
    alias: 'spellcheck'
  allowFullScreen:
    type: Types.Property
    alias: 'allowFullscreen'
  autoCapitalize:
    type: Types.Property
    alias: 'autocapitalize'
  autoFocus:
    type: Types.Property
    alias: 'autofocus'
  autoPlay:
    type: Types.Property
    alias: 'autoplay'
}