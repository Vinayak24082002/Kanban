import { useState } from "react";
import AddIcon from "../assets/add.svg";

export const Task = ({ addTask }) => {
  const [isTakingInput, setIsTakingInput] = useState(false);
  return (
    <>
      
      <img
        className="max-w-full w-6 h-full aspect-square"
        src={AddIcon}
        onClick={() => setIsTakingInput(!isTakingInput)}
      />
      {isTakingInput ? (
        <div className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center bg-[#0b080840]">
          <div className="flex flex-col gap-4 text-[#1e1e1e] py-7 px-9 pb-10 bg-white rounded-xl">
            Add New Task
            <FormInput
              className={"flex flex-col gap-4"}
              inputClassName={
                "p-2 px-4 border rounded bg-white text-black border-4 rounded-lg"
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

      {/* // </div> */}
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
      className={`${className} `}
      onSubmit={(event) => {
        event.preventDefault();
        const item = {
          title: title.trim(),
          content: content.trim(),
          tags: tags.split(",").map((tag) => tag.trim()),
          collabs: collabs.split(",").map((collab) => collab.trim()),
        };
        handleSubmit(item);
        setInput("");
      }}
    >
      <Input
        type="text"
        value={title}
        label={"Task Title"}
        placeholder={"Enter Title"}
        className={inputClassName}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        type="text"
        value={content}
        label={"Task Content"}
        placeholder={"Enter Content"}
        className={inputClassName}
        onChange={(e) => setContent(e.target.value)}
      />
      <Input
        type="textarea"
        value={tags}
        label="Tags"
        placeholder={"Enter Tags\n (comma seperated)"}
        className={inputClassName}
        onChange={(e) => setTags(e.target.value)}
        optional
      />
      <Input
        type="textarea"
        value={collabs}
        label="Collaborators"
        placeholder={"Enter Colabs's Email (comma seperated)"}
        className={inputClassName}
        onChange={(e) => setCollabs(e.target.value)}
        optional
      />
      <button className="bg-blue-500 text-white p-2 rounded-lg">
        {" "}
        Add Task{" "}
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
  //   const [input, setInput] = useState("");
  return (
    <label className="flex flex-col gap-1">
      <span className="text-lg font-semibold flex gap-2 justify-start items-center ">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
        {optional && !required ? (
          <span className="text-slate-400 italic text-xs">
            {"( Optional )"}
          </span>
        ) : null}
      </span>
      {type === "textarea" ? (
        <textarea
          required={required}
          value={value}
          placeholder={placeholder}
          className={className}
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