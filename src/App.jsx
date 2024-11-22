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
    <div className="Board w-full h-full min-h-screen flex flex-col lg:flex-row gap-4 bg-[#F7F7F7] text-[#0e0a0a] p-4 overflow-auto">
      {board.map(({ id, stage, label, setStage }, index) => (
        <Stage
          id={id}
          key={"stage-" + index}
          label={label}
          addTask={(newItem) => {
            if (!newItem) return;
            let value = {
              ...newItem,
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
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.currentTarget.classList.add("drag-wrapper")}
      onDragLeave={(e) =>
        e.currentTarget.classList.remove("drag-wrapper")
      }
      className="Stage p-4 flex-1 flex flex-col gap-4 text-lg font-semibold overflow-auto border-2 border-transparent bg-white shadow-md rounded-lg"
    >
      <div className="flex px-2 py-4 justify-between items-center">
        <h4 className="text-xl">{label}</h4>
        <Task addTask={addTask} />
      </div>
      {children}
    </div>
  );
};

const Item = ({ id, parentId, history, deleteItem, ...rest }) => {
  const { title, content, tags, collabs } = rest;
  const [currHistory, setCurrHistory] = useState(history);

  useEffect(() => {
    if (history.length > 0 && history[history.length] === parentId) return;
    setCurrHistory([...currHistory, parentId]);
  }, []);

  const onDragStartFn = (e) => {
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

  return (
    <div
      draggable
      onDragStart={onDragStartFn}
      className="Item border shadow rounded-lg flex flex-col justify-start items-start bg-[#FFFFFF] p-4 gap-4 text-sm sm:text-base"
    >
      <div className="flex justify-between items-center w-full">
        <h4 className="font-semibold truncate">{title}</h4>
        <button
          onClick={deleteItem}
          className="text-red-500 text-xs sm:text-sm hover:underline"
        >
          Delete
        </button>
      </div>
      <p className="text-gray-600 text-sm truncate">{content}</p>
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex -space-x-2">
        {collabs.slice(0, 4).map((collab, index) => (
          <span
            key={index}
            className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm"
          >
            {collab[0].toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};
