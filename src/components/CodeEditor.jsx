import { useEffect, useReducer, useRef } from "react";
import { FaSquareGithub } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { ViewsCounter } from "./component";

const initialState = {
  code: "",
  output: null,
  error: null,
  run: false,
  loading: false,
  Disabled: false,
  emptyAlert: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "TYPING": {
      return {
        ...state,
        code: action.value,
        output: null,
        loading: false,
        run: false,
        Disabled: false,
        error: null,
        emptyAlert: "",
      };
    }
    case "RUN": {
      return {
        ...state,
        loading: true,
        run: true,
        Disabled: true,
        error: null,
      };
    }
    case "RESULT": {
      return {
        ...state,
        loading: false,
        output: action.value,
        Disabled: true,
        run: false,
        emptyAlert: "",
      };
    }
    case "ERROR": {
      return {
        ...state,
        error: action.value,
        disabled: true,
        run: false,
        emptyAlert: "",
      };
    }
    case "CLEAR": {
      return {
        ...state,
        code: "",
        run: false,
        output: null,
        loading: false,
        Disabled: false,
        error: null,
        emptyAlert: "",
      };
    }
    case "EMPTY": {
      return {
        ...state,
        emptyAlert: action.value,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

const CodeEditor = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { code, run, output, error, loading, Disabled, emptyAlert } = state;
  const inputRef = useRef(null);

  useEffect(() => {
    if (run) {
      const worker = new Worker("./worker.js");

      worker.postMessage({
        code,
      });

      worker.addEventListener("message", (e) => {
        dispatch({
          type: "RESULT",
          value: e.data,
        });

        if (e.data.Error) {
          dispatch({
            type: "ERROR",
            value: e.data.Error,
          });
        }
      });
    }

    if (/^\s+$/.test(code)) {
      dispatch({
        type: "EMPTY",
        value: "Write Some JavaScript code at INPUT area.",
      });
    }
  }, [code, run]);

  const inputHandler = (e) => {
    dispatch({
      type: "TYPING",
      value: e.target.innerText,
    });
  };

  const clearHandler = () => {
    dispatch({
      type: "CLEAR",
    });
    inputRef.current.innerText = "";
  };

  const runCode = () => {
    if (inputRef.current.innerText.toString().length > 0) {
      dispatch({ type: "RUN" });
    }
  };

  return (
    <div className="bg-gray-900  p-3 rounded-md max-w-full ">
      <div className="text-white text-center text-2xl font-bold py-2">
        JS Compiler
      </div>
      <div className="border border-gray-400 bg-gray-700 p-2 rounded-md w-[1200px] max-w-full h-[650px] flex justify-start items-center flex-col md:flex-row gap-3 ">
        <div className="w-full h-[50%] md:h-full relative">
          <div className="text-gray-200 select-none font-bold py-2">INPUT</div>
          <div
            contentEditable
            suppressContentEditableWarning={true}
            onKeyUp={inputHandler}
            ref={inputRef}
            className="border border-gray-500 w-full h-[calc(100%-50px)] bg-gray-400 rounded-md  text-gray-900 shadow-gray-950 shadow-inner focus:outline-none overflow-y-auto relative p-2 tracking-[1px] font-bold"
          ></div>
        </div>
        <div className="flex md:flex-col flex-wrap gap-5 justify-center">
          <button
            className="bg-gray-600 py-1 px-2 rounded-md font-bold text-gray-200 border border-gray-500 hover:bg-gray-900 select-none transition-all duration-100"
            onClick={runCode}
            disabled={Disabled}
          >
            Run
          </button>
          <button
            className="bg-gray-600 py-1 px-2 rounded-md font-bold text-gray-200 border border-gray-500 hover:bg-gray-900 select-none transition-all duration-100"
            onClick={clearHandler}
          >
            Clear
          </button>
          <Link
            className="text-4xl text-center"
            to="https://github.com/LoveItsYou/JScompiler"
            target="_blank"
          >
            <FaSquareGithub className="inline-block bg-white rounded-lg" />
          </Link>
          <div className="text-white bg-gray-600 p-[3px] rounded-lg text-sm text-center">
            <p>Visited</p>
            <ViewsCounter />
          </div>
        </div>
        <div className="w-full h-[50%] md:h-full">
          <div className="text-gray-200 select-none font-bold py-2">OUTPUT</div>
          <div className="border border-gray-500 w-full h-[calc(100%-50px)] bg-gray-400 rounded-md p-2 shadow-gray-950 shadow-inner focus:outline-none overflow-y-auto">
            {loading && (
              <div className="text-center font-bold text-gray-200">
                Loading...
              </div>
            )}
            {error && (
              <div>
                <span className="text-red-700 font-bold shadow-black">
                  {error.name}
                </span>{" "}
                : <span>{error.message}</span>
              </div>
            )}
            {emptyAlert && (
              <p className="text-red-500 font-bold">{emptyAlert}</p>
            )}
            <div className="flex flex-col">
              {output?.execution &&
                !error &&
                Object.entries(output.execution).map(([line, result]) => {
                  return (
                    <div key={line} className="flex">
                      {/* <p className="bg-red-200 px-2">{line}</p> */}
                      <p className="flex flex-col text-black">{result}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
