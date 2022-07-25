# react-tiny-dnd
[![npm version](https://img.shields.io/npm/v/react-tiny-dnd?logo=npm)](https://www.npmjs.com/package/react-tiny-dnd)
[![npm downloads](https://img.shields.io/npm/dw/react-tiny-dnd?logo=npm)](https://www.npmjs.com/package/react-tiny-dnd)
[![npm size](https://img.shields.io/bundlephobia/minzip/react-tiny-dnd?logo=npm)](https://www.npmjs.com/package/react-tiny-dnd)
![commit activity](https://img.shields.io/github/commit-activity/y/hosembafer/react-tiny-dnd)
![license](https://img.shields.io/github/license/hosembafer/react-tiny-dnd)

Drag and Drop library for React.

### [Demo](https://react-tiny-dnd.netlify.app)

## Install via [npm](https://www.npmjs.com/package/react-tiny-dnd)

```shell
npm install react-tiny-dnd
```

or

```shell
yarn add react-tiny-dnd
```

## Features
- Vertical lists
- Touch support 📱 (desktop and mobile) 
- Extra small [![npm size](https://img.shields.io/bundlephobia/minzip/react-tiny-dnd?label=%20)](https://www.npmjs.com/package/react-tiny-dnd)
- Easy auto scrolling [integration](https://github.com/hosembafer/react-tiny-dnd/blob/main/demo/src/App.tsx#L97) 🔥
- Add and remove items with no doubts
- Variable heights supported by design 🚀
- Custom preview component for draggable
- Custom drag handles
- Multiple drag handlers

## Usage

App.js
```JSX
const [items, setItems] = useState(defaultItems);

const onDrop = (dragIndex: number, overIndex: number) => {
  const nextItems = moveItems(items, dragIndex, overIndex);
  setItems(nextItems);
};

const context = useDraggableContext({
  onDrop,
});

return (
  <>
    {items.map((item, i) => {
      return (
        <DraggableItem context={context} key={item.id} index={i} item={item} />
      );
    })}
  </>
);
```

DraggableItem.js
```JSX
const DraggableItem = ({
  index,
  context,
  item,
}) => {
  const {
    listeners, // Handler listeners can be passed to Draggable component as well
    isDragging,
  } = useDraggable(context, index);
  
  return (
    <Draggable
      context={context}
      key={item.id}
      index={index}
      preview={
        <Item id={item.id} color={item.color} listeners={listeners} isDragging={false} />
      }
    >
      <Item
        item={item}
        handler={(
          <div className="dnd-icon" {...listeners}>
            <img src={dndIc} alt="dnd" />
          </div>
        )}
      />
    </Draggable>
  );
};
```

## API

#### useDraggableContext
- `onDrop: Function` - fires when the item drops in the desired place
- `snapThreshold?: number` - the threshold from which drop areas will be highlighted

Returns `DraggableContextType` - containing the dragging state

#### useDraggable
- `context: DraggableContextType` - containing the dragging state
- `index: number` - uses to identify the item

Returns `{ listeners: EventHandler[], isDragging: boolean }`

#### Draggable
- `context: DraggableContextType` - containing the dragging state
- `index: number` - uses to identify the item
- `listeners?: EventHandler[]` - containing dragging event handlers and can be passed to your desired handler (one or more)
