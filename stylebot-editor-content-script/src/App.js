import React from "react";
import styled from "styled-components";
import root from "react-shadow";
import { useDebouncedValue, useDispose } from "./useGeneric.js";
import { TextEditor } from "./Editor.js";
import { RenderObject } from "./parse.js";
import Highlight from "./Highlight";

import "../../test.js";

let Title = styled.div`
  font-size: 25px;
  padding: 16px;
  color: white;
`;

let StyledEditor = styled.div`
  color: #f78416;

  white-space: pre;
  overflow-y: auto;
  /* overflow-x: scroll; */

  font-family: Menlo;
  caret-color: white;
  line-height: 1.4em;

  padding: 16px;
  font-size: 16px;

  --symbol: #f78416;
  --name: #dd0000;
  --value: #4c9a89;

  & [contenteditable]:focus {
    outline: none;
  }

  .node-selectors,
  .node-call_expression {
    color: var(--name);
  }
  .node-property_name,
  .node-class_name,
  [data-text="."] {
    color: var(--symbol);
  }
  .node-plain_value,
  .node-string_value,
  .node-integer_value,
  .node-color_value {
    color: var(--value);
  }

  .node-comment {
    color: white;
    opacity: 0.5;
  }

  [data-text="="],
  [data-text="{"],
  [data-text="}"],
  [data-text="["],
  [data-text="]"],
  [data-text="("],
  [data-text=")"],
  [data-text=":"],
  [data-text=";"],
  [data-text="#"],
  .node-unit {
    opacity: 0.5;
  }
`;

let used_nodes = [
  "selectors",
  "call_expression",
  "property_name",
  "class_name",
  "plain_value",
  "string_value",
  "integer_value"
];

let App = ({ parser, css, onCssChange }) => {
  let style_element_ref = React.useRef();
  let [code, set_code] = React.useState(css);

  const tree = React.useMemo(() => {
    let result = parser.parse(code);
    return result;
  }, [code, parser]);

  // const tree = parser.parse(code);
  useDispose(tree, tree => {
    tree.delete();
  });

  let [saved_code] = useDebouncedValue(code, 50);
  React.useEffect(() => {
    onCssChange(saved_code);
  }, [saved_code]);

  let [applied_code] = useDebouncedValue(code, 200);
  React.useEffect(() => {
    if (style_element_ref.current == null) {
      style_element_ref.current =
        document.querySelector("style[data-dral-styled]") ||
        document.createElement("style");
      document.head.appendChild(style_element_ref.current);
    }

    let css_tweaked = applied_code.replace(/(?:!important)? *;(\n|$)/gm,' !important;$1');
    style_element_ref.current.innerHTML = css_tweaked;
  }, [applied_code]);

  React.useEffect(() => {
    return () => {
      if (style_element_ref.current) {
        style_element_ref.current.remove();
      }
    };
  }, []);

  return (
    <div
      style={{
        zIndex: 100000000,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 400,

        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: `blur(25px)`
      }}
    >
      <div>
        <Title>CSS</Title>
      </div>

      {/* <Highlight /> */}

      <StyledEditor
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <TextEditor
          style={{ flex: 1 }}
          text={code}
          // content={code}
          content={
            <RenderObject used_nodes={used_nodes} tree={tree} text={code} />
          }
          onChange={new_code => {
            set_code(new_code);
          }}
          spellCheck="false"
          // onClick={event => {
          //   let path = get_node_path_up(event.target, event.currentTarget);
          //   onNodeClick(path);
          // }}
        />
      </StyledEditor>
    </div>
  );
};

// export default (props) => <Unset ><App {...props} /></Unset>;
export default props => (
  <root.div>
    <App {...props} />
  </root.div>
);
