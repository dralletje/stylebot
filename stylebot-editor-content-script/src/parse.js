import React from "react";

let normalized_text = children => {
  return children
    .map(element => {
      if (element.$children) return normalized_text(element.$children);
      if (element.$text) return element.$text;
      if (element.$unknown) return element.$unknown;
      return "";
    })
    .join("");
};
let normalized_hightlight = (element, index) => {
  if (element.$text != null) {
    return (
      <span
        key={index}
        className={`node-${element.type} ${
          element.is_missing ? "node-MISSING" : ""
        }`}
        data-text={element.$text}
      >
        {element.$text}
      </span>
    );
  }
  if (element.$unknown != null) {
    return (
      <span key={index} className="node-unknown">
        {element.$unknown}
      </span>
    );
  }
  if (element.$children != null) {
    return (
      <span key={index} className={`node-${element.type}`}>
        {element.$children.map((x, i) => normalized_hightlight(x, i))}
      </span>
    );
  }
  throw new Error(`Unknown element ${Object.keys(element)}`);
};

// Is this too expensive to normalize by default?
let normalize_tree = (tree, text, used_nodes) => {
  let elements = [];

  let last_position = tree.startIndex;
  let current_child = tree.firstChild;
  while (current_child != null) {
    if (last_position !== current_child.startIndex) {
      elements.push({
        $unknown: text.slice(last_position, current_child.startIndex)
      });
    }

    let is_missing = current_child.startIndex === current_child.endIndex;

    if (current_child.childCount === 0) {
      let text = current_child.text;
      elements.push({
        // type: !current_child.isNamed || text === current_child.type ? "syntax" : current_child.type,
        type: !current_child.isNamed() ? "syntax" : current_child.type,
        is_missing: is_missing,
        $text: text
      });
    } else {
      // if (used_nodes.includes(type)) {
      elements.push({
        type: current_child.type,
        is_missing: is_missing,
        $children: normalize_tree(current_child, text, used_nodes)
      });
      // } else {
      //   for (let element of normalize_tree(current_child, text, used_nodes)) {
      //     elements.push(element);
      //   }
      // }
    }

    last_position = current_child.endIndex;
    current_child = current_child.nextSibling;
  }

  if (last_position !== tree.endIndex) {
    elements.push({
      $unknown: text.slice(last_position, tree.endIndex)
    });
  }

  return elements;
};

export let RenderObject = ({ tree, text, used_nodes }) => {
  if (text.length > 100 * 1000) {
    return text;
  } else {
    let normalized = [
      ...(tree.rootNode.startIndex === 0
        ? []
        : [{ $unknown: text.slice(0, tree.rootNode.startIndex) }]),
      ...normalize_tree(tree.rootNode, text, used_nodes)
    ].map((x, i) => normalized_hightlight(x, i));
    return normalized;
  }
};
