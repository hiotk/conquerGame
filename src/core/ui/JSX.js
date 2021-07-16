export function JSXComponent(tag, attrs, ...children) {
  const element = new tag();
  if(!!attrs) {
    const props = element.props;
    props.forEach(propName=>{
        if(attrs[propName]) {
          element[propName] = attrs[propName];
        }
    })
  }
  element.children = children;
  element.children.forEach(child=>{
    child.parent = element;
  })
  return element;
};

export default {
  JSXComponent
}
