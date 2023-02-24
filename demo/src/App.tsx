import { FC, useRef, useState } from "react";
import { useAutoScroll } from "react-tiny-autoscroll";
import dndIc from "./assets/icons/dnd.svg";
import deleteIc from "./assets/icons/delete.svg";
import { Draggable, moveItems, useDraggable, useDraggableContext } from "react-tiny-dnd";

function hashCode(str: string) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i: number) {
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return "#" + "00000".substring(0, 6 - c.length) + c;
}

const hashToColor = (hash: string) => intToRGB(hashCode(hash));

const buildItem = (n: number) => {
  const id = String(n + 1);
  return {
    id,
    color: hashToColor(id.repeat(10)),
  };
};

const defaultItems = Array(100).fill(null).map((_, i) => buildItem(i));

const Item: FC<{ id: string | number | undefined, color: string, listeners?: any, isDragging: boolean, handleDelete?: Function }> = ({
  id,
  color: backgroundColor,
  listeners,
  isDragging,
  handleDelete,
}) => {
  const index = Number(id);
  const opacity = isDragging ? 0.5 : 1;

  let height: string | number = "initial";
  if (index % 3 === 0) {
    height = 110;
  } else if (index % 4 === 0) {
    height = 70;
  }

  return (
    <div className="item" style={{ height, opacity, backgroundColor: "white" }}>
      <div style={{ display: "flex", flex: 1, alignItems: "center", fontWeight: "bold" }}>
        <div className="color-badge" style={{ backgroundColor }} {...listeners}></div>
        {id}
      </div>
      <div className="delete-icon" onClick={() => handleDelete?.()}>
        <img src={deleteIc} alt="delete" />
      </div>
      <div className="dnd-icon" {...listeners}>
        <img src={dndIc} alt="dnd" />
      </div>
    </div>
  );
}

const DraggableItem = ({
  index,
  context,
  item,
  handleDelete,
}: any) => {
  const { listeners, isDragging } = useDraggable(context, index);

  return (
    <Draggable
      context={context}
      key={item.id}
      index={index}
      dividerClassName="custom-divider"
      {...{
        preview: <div style={{ width: 500 }}>
          <Item id={item.id} color={item.color} listeners={listeners} isDragging={false} />
        </div>
      }}
    >
      <Item id={item.id} color={item.color} listeners={listeners} isDragging={isDragging} handleDelete={() => handleDelete(item.id)} />
    </Draggable>
  );
};

function App() {
  const [items, setItems] = useState(defaultItems);

  const onDrop = (dragIndex: number, overIndex: number) => {
    const nextItems = moveItems(items, dragIndex, overIndex);
    setItems(nextItems);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const context = useDraggableContext({
    onDrop,
  });

  useAutoScroll({ containerRef, skip: !context.isDragging });

  const handleDelete = (id: string) => setItems(items.filter((item) => item.id !== id))

  return (
    <div style={{ margin: 40, padding: 40 }}>
      <input type="number" value={3} />
      <input type="text" value="Hello, world!" />
      Those inputs are temporary and for testing purposes, just ignore.<br /><br />

      <div ref={containerRef} className="container">
        {items.map((item, i) => {
          return (
            <DraggableItem context={context} key={item.id} index={i} item={item} handleDelete={handleDelete} />
          );
        })}
      </div>
    </div>
  );
}

export default App;
