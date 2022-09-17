export function emit (instance, event, ...args) {
  console.log('emitHandle', event)

  const { props } = instance
  console.log('props', props);

  // TPP
  // 先写一个固定的行为 -> 再抽象成默认的行为
  // add => Add

  // add-foo => addFoo
  const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (_, c: string) => {
      console.log('_', _, c);
      return c ? c.toUpperCase() : ''
    })
  }

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const toHandlerKey = (str: string) => {
    return str ? 'on' + capitalize(str) : ''
  }

  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...args)
}
