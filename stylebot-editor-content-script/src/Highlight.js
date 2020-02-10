import React from "react";
import ReactDOM from "react-dom";
import { isEmpty } from "lodash";
import root from "react-shadow";

let get_classes = element => {
  return Array.from(element.classList.values())
    .map(x => `.${x}`)
    .join("");
};
let get_id = element => {
  if (isEmpty(element.id)) {
    return "";
  } else {
    return `#${element.id}`;
  }
};
let get_selector = element => {
  return {
    tag: element.tagName.toLowerCase(),
    id: get_id(element),
    classes: get_classes(element)
  };
};

let parents = element => {
  let current = element;
  let items = [];
  while (current != null && current !== document.body) {
    items.push(current);
    current = current.parentElement;
  }
  return items;
};

let Selector = ({ selector }) => {
  return (
    <span style={{ marginRight: 16 }}>
      {selector.tag && (
        <span style={{ color: "rgb(148, 0, 146)" }} children={selector.tag} />
      )}
      {selector.id && (
        <span style={{ color: "rgb(10, 156, 0)" }} children={selector.id} />
      )}
      {selector.classes && (
        <span
          style={{ color: "rgb(204, 208, 0)" }}
          children={selector.classes}
        />
      )}
    </span>
  );
};

let Overlay = ({ children }) => {
  let container = React.useRef();
  if (container.current == null) {
    container.current = document.createElement("div");
  }
  React.useEffect(() => {
    document.body.appendChild(container.current);
    return () => container.current.remove();
  }, []);

  return ReactDOM.createPortal(
    <root.div>{children}</root.div>,
    container.current
  );
};

let Highlight = () => {
  let [boxcoords, set_boxcoords] = React.useState(null);
  let [selectors, set_selectors] = React.useState([]);
  let [selected, set_selected] = React.useState(null);

  let handler = React.useCallback(e => {
    // TODO elementsFromPoint
    let element = document.elementFromPoint(e.clientX, e.clientY);

    if (element == null || element.shadowRoot != null) {
      set_selectors(null);
      set_boxcoords(null);
      return;
    }

    let rect = element.getBoundingClientRect();
    set_boxcoords(rect);

    let selectors = parents(element).map(x => get_selector(x));
    set_selectors(selectors);
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  });

  let mouseclickhandler = React.useCallback(
    e => {
      if (boxcoords == null) {
        return;
      }

      if (
        boxcoords.left < e.clientX &&
        e.clientX < boxcoords.right &&
        boxcoords.top < e.clientY &&
        e.clientY < boxcoords.bottom
      ) {
        e.stopPropagation();
        e.preventDefault();
        set_selected({
          coords: boxcoords,
          selectors: selectors
        });
      }
    },
    [boxcoords, selectors]
  );

  React.useEffect(() => {
    document.addEventListener("mousedown", mouseclickhandler);
    return () => document.removeEventListener("mousedown", mouseclickhandler);
  });
  React.useEffect(() => {
    document.addEventListener("mouseup", mouseclickhandler);
    return () => document.removeEventListener("mouseup", mouseclickhandler);
  });
  React.useEffect(() => {
    document.addEventListener("click", mouseclickhandler);
    return () => document.removeEventListener("click", mouseclickhandler);
  });

  return (
    <React.Fragment>
      {boxcoords && (
        <Overlay>
          <div
            style={{
              pointerEvents: "none",
              position: "fixed",
              top: boxcoords.top,
              width: boxcoords.width,
              left: boxcoords.left,
              height: boxcoords.height,
              zIndex: 10000000,
              backgroundColor: "rgba(238, 168, 195, 0.67)"
            }}
          ></div>
        </Overlay>
      )}

      {selected && (
        <Overlay>
          <div
            style={{
              pointerEvents: "none",
              position: "fixed",
              top: selected.coords.top,
              width: selected.coords.width,
              left: selected.coords.left,
              height: selected.coords.height,
              zIndex: 100000000,
              backgroundColor: "rgba(233, 21, 103, 0.67)"
            }}
          ></div>
        </Overlay>
      )}

      <div style={{}}>
        {(selectors || (selected && selected.selectors) || []).map(
          (selector, index) => (
            <Selector key={index} selector={selector} />
          )
        )}
      </div>
    </React.Fragment>
  );
};

export default Highlight;
