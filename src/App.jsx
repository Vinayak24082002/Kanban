
import { useEffect, useState } from "react";
import "./App.css";
import { Task } from "./components/Task";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function App() {
  const [stage1, setStage1] = useState([]);
  const [stage2, setStage2] = useState([]);
  const [stage3, setStage3] = useState([]);
  const board = [
    { id: "stage1", label: "Test", stage: stage1, setStage: setStage1 },
    { id: "stage2", label: "Sample", stage: stage2, setStage: setStage2 },
    { id: "stage3", label: "Example", stage: stage3, setStage: setStage3 },
  ];

  return (
    <div className="Board min-w-full w-full h-full min-h-full flex-1 flex self-stretch gap-4 bg-[#F7F7F7] text-[#0e0a0a]">
      {board.map(({ id, stage, label, setStage }, index) => (
        <Stage
          id={id}
          key={"stage-" + index}
          label={label}
          addTask={(newItem) => {
            if (!newItem) return;
            let value = {
              ...newItem,
              // value: newItem,
              id: generateId(),
              parentId: id,
              history: [],
            };
            setStage([...stage, value]);
          }}
          moveTask={(item, fromParentId, toParentId) => {
            console.log("moving", item, fromParentId, toParentId);
            const fromStage = board.find(({ id }) => id === fromParentId);
            const toStage = board.find(({ id }) => id === toParentId);
            fromStage.setStage(
              fromStage.stage.filter(({ id }) => id !== item.id)
            );
            toStage.setStage([
              ...toStage.stage,
              { ...item, parentId: toParentId },
            ]);
          }}
        >
          {stage.map(
            (
              { id, parentId, history, title, content, tags, collabs },
              index
            ) => (
              <Item
                key={"1" + index}
                title={title}
                content={content}
                tags={tags}
                collabs={collabs}
                id={id}
                parentId={parentId}
                history={history}
                deleteItem={() => {
                  setStage(stage.filter((item) => item.id !== id));
                }}
              />
            )
          )}
        </Stage>
      ))}
    </div>
  );
}

export default App;

const Stage = ({ id, label, addTask, moveTask, children }) => {
  const onDrop = (e) => {
    // console.log("dropped", e.dataTransfer.getData("draggedItem"));
    const item = JSON.parse(e.dataTransfer.getData("draggedItem"));
    const { id: itemId, value, parentId, history } = item;
    if (parentId === id) return;
    moveTask(item, parentId, id);
  };
  return (
    <div
      id={id}
      onDrop={(e) => {
        onDrop(e);
        e.currentTarget.classList.remove("drag-wrapper");
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={(e) => e.currentTarget.classList.add("drag-wrapper")}
      onDragLeave={(e) =>
        console.log(
          e,
          e.target,
          e.currentTarget.classList.remove("drag-wrapper")
        )
      }
      className="Stage p-4 w-full flex-1 flex flex-col gap-4 text-lg font-semibold overflow-auto border-2 border-transparent"
    >
      <div className="flex px-2 py-4">
        <h4 className="text-xl w-full flex-1 flex justify-start">{label}</h4>
        <Task addTask={addTask} />
      </div>
      {children}
    </div>
  );
};
// #365EFF

const Item = ({ id, parentId, history, deleteItem, ...rest }) => {
  const { title, content, tags, collabs } = rest;
  const [currHistory, setCurrHistory] = useState(history);
  useEffect(() => {
    if (history.length > 0 && history[history.length] === parentId) return;
    setCurrHistory([...currHistory, parentId]);
  }, []);
  const onDragStartFn = (e) => {
    console.log("dragging", e.target.innerHTML);
    e.dataTransfer.setData(
      "draggedItem",
      JSON.stringify({
        id,
        parentId,
        history: currHistory,
        ...rest,
      })
    );
  };
  const onDragEndFn = (e) => {
    console.log("drag ended");
  };
  return (
    <div
      draggable
      onDragStart={onDragStartFn}
      onDragEnd={onDragEndFn}
      className="Item border shadow rounded-lg flex flex-col justify-start items-start bg-[#FFFFFF]"
    >
      <div className="p-4 flex flex-col justify-start items-start gap-4">
        <div className="flex justify-start ">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-[#365EFF99] text-[#fff7d1] px-4 py-1.5 pb-2 rounded-full text-sm"
            >
              {tag}
            </span>
          ))} 
          <button onClick={deleteItem}>Delete</button>
        </div>
        <h4 className="text-lg leading-none font-semibold">{title}</h4>
        {content ? (
          <p className="text-xs opacity-90 text-wrap leading-3 truncate--x">
            {content}
          </p>
        ) : null}
      </div>
      <div className="h-1 border w-full" />
      <div className="p-4 flex justify-start items-start">
        {collabs.slice(0, 4).map((collab, index) => {
          console.log(`translate-x-[-${index*50}%] `);
          return(
          <span
            key={index}
            className={`p-2 w-10 h-10 aspect-square bg-[#365EFF] text-[#fff7d1] text-base rounded-full translate-x-[-${index*50}%] `}
          >
            {collab.slice(0, 1).toUpperCase()}
          </span>
        )})}
      </div>
    </div>
  );
};


