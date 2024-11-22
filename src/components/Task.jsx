import { useState } from "react";
import AddIcon from "../assets/add.svg";

export const Task = ({ addTask }) => {
  const [isTakingInput, setIsTakingInput] = useState(false);
  return (
    <>
      <img
        className="w-6 h-6 aspect-square cursor-pointer sm:w-8 sm:h-8"
        src={AddIcon}
        onClick={() => setIsTakingInput(!isTakingInput)}
      />
      {isTakingInput ? (
        <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-[#0b080840]">
          <div className="flex flex-col gap-4 text-[#1e1e1e] py-7 px-5 sm:px-9 bg-white rounded-xl max-w-md w-full">
            <h2 className="text-lg font-bold">Add New Task</h2>
            <FormInput
              className={"flex flex-col gap-4"}
              inputClassName={
                "p-2 px-4 border rounded bg-white text-black border-2 rounded-lg"
              }
              placeholder="Enter your task"
              handleSubmit={(value) => {
                addTask(value);
                setIsTakingInput(false);
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

const FormInput = ({
  className,
  inputClassName,
  placeholder,
  handleSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [collabs, setCollabs] = useState("");

  return (
    <form
      className={`${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        const item = {
          title: title.trim(),
          content: content.trim(),
          tags: tags.split(",").map((tag) => tag.trim()),
          collabs: collabs.split(",").map((collab) => collab.trim()),
        };
        handleSubmit(item);
        setTitle("");
        setContent("");
        setTags("");
        setCollabs("");
      }}
    >
      <Input
        type="text"
        value={title}
        label="Task Title"
        placeholder="Enter Title"
        className={inputClassName}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        type="text"
        value={content}
        label="Task Content"
        placeholder="Enter Content"
        className={inputClassName}
        onChange={(e) => setContent(e.target.value)}
      />
      <Input
        type="textarea"
        value={tags}
        label="Tags"
        placeholder="Enter Tags (comma separated)"
        className={inputClassName}
        onChange={(e) => setTags(e.target.value)}
        optional
      />
      <Input
        type="textarea"
        value={collabs}
        label="Collaborators"
        placeholder="Enter Collaborators' Emails (comma separated)"
        className={inputClassName}
        onChange={(e) => setCollabs(e.target.value)}
        optional
      />
      <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all">
        Add Task
      </button>
    </form>
  );
};

const Input = ({
  type = "text",
  value = "",
  label = "",
  placeholder = "",
  className = "",
  onChange = () => {},
  required = false,
  optional = false,
}) => {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm sm:text-base font-semibold flex gap-2 justify-start items-center">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
        {optional && !required ? (
          <span className="text-slate-400 italic text-xs">(Optional)</span>
        ) : null}
      </span>
      {type === "textarea" ? (
        <textarea
          required={required}
          value={value}
          placeholder={placeholder}
          className={`${className} resize-none`}
          onChange={onChange}
        />
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          placeholder={placeholder}
          className={className}
          onChange={onChange}
        />
      )}
    </label>
  );
};