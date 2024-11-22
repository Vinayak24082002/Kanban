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
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("draggedItem"));
    if (item.parentId === id) return;
    moveTask(item, item.parentId, id);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.id === id) {
      element.classList.add("drag-wrapper");
    }
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.id === id) {
      const draggedItem = JSON.parse(localStorage.getItem("draggedItem"));
      if (draggedItem && draggedItem.parentId !== id) {
        moveTask(draggedItem, draggedItem.parentId, id);
        localStorage.removeItem("draggedItem");
      }
    }
    e.currentTarget.classList.remove("drag-wrapper");
  };

  return (
    <div
      id={id}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.currentTarget.classList.add("drag-wrapper")}
      onDragLeave={(e) => e.currentTarget.classList.remove("drag-wrapper")}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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

const Item = ({ id, parentId, deleteItem, ...rest }) => {
  const onDragStartFn = (e) => {
    e.dataTransfer.setData(
      "draggedItem",
      JSON.stringify({ id, parentId, ...rest })
    );
    localStorage.setItem("draggedItem", JSON.stringify({ id, parentId, ...rest }));
  };

  const handleTouchStart = (e) => {
    localStorage.setItem("draggedItem", JSON.stringify({ id, parentId, ...rest }));
  };

  return (
    <div
      draggable
      onDragStart={onDragStartFn}
      onTouchStart={handleTouchStart}
      className="Item border shadow rounded-lg flex flex-col justify-start items-start bg-[#FFFFFF] p-4 gap-4 text-sm sm:text-base"
    >
      <div className="flex justify-between items-center w-full">
        <h4 className="font-semibold truncate">{rest.title}</h4>
        <button
          onClick={deleteItem}
          className="text-red-500 text-xs sm:text-sm hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
