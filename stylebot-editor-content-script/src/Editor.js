import React from "react";
import { debounce, last } from "lodash";
import ReactDOM from "react-dom";

let get_text_nodes = element => {
  let text_nodes = [];
  let walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    text_nodes.push(node);
  }
  return text_nodes;
};

function getCaretData(root_element, start, end) {
  let nodes = get_text_nodes(root_element);
  let position = 0;

  let start_result = null;
  let end_result = null;

  for (let node of nodes) {
    if (start_result == null) {
      if (position + node.nodeValue.length > start) {
        // remove amount from the position, go to next node
        start_result = { node: node, offset: start - position };
      }
    }
    if (end_result == null) {
      if (position + node.nodeValue.length > end) {
        // remove amount from the position, go to next node
        end_result = { node: node, offset: end - position };
      }
    }

    if (start_result != null && end_result != null) {
      return {
        start: start_result,
        end: end_result
      };
    }

    position = position + node.nodeValue.length;
  }

  let last_node = last(nodes);

  if (last_node == null) {
    return {
      start: { node: root_element, offset: 0 },
      end: { node: root_element, offset: 0 }
    };
  } else {
    return {
      start: start_result || {
        node: last_node,
        offset: last_node.nodeValue.length
      },
      end: end_result || {
        node: last(nodes),
        offset: last_node.nodeValue.length
      }
    };
  }
}

// setting the caret with this info  is also standard
let setCaretPosition = (shadowRoot, d) => {
  try {
    let root = shadowRoot;
    let sel = root.getSelection();
    let range = document.createRange();
    range.setStart(d.start.node, d.start.offset);
    range.setEnd(d.end.node, d.end.offset);
    // range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (err) {
    console.log("Range err:", err);
  }
};

let get_current_carret_position = (root, element) => {
  let range = root.getSelection().getRangeAt(0);
  // TODO Check if range is even inside the editable element

  var preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  let end_offset = preCaretRange.toString().length;
  preCaretRange.setEnd(range.startContainer, range.startOffset);
  let start_offset = preCaretRange.toString().length;
  return { end: end_offset, start: start_offset };
};

let get_text_slices_from_carret = ({ end, start }, text) => {
  return {
    before: text.slice(0, start),
    selected: text.slice(start, end),
    after: text.slice(end)
  };
};

let defaultProps = {
  content: "",
  editable: true,
  multiline: true,
  innerRef: () => {},
  onChange: () => {}
};

let get_parent = (child, selector) => {
  if (child == null) return null;
  if (child.matches(selector)) {
    return child;
  } else {
    return get_parent(child.parentElement, selector);
  }
};

export class TextEditor extends React.Component {
  static defaultProps = defaultProps;

  state = {
    meta_active: false
  };

  next_cursor_position = null;
  just_did_redo = false;
  just_did_undo = false;
  _element = null;

  undo_stack = [];
  redo_stack = [];
  save_undo = debounce(
    ({ text, cursor_position }) => {
      let last_stack = this.undo_stack[this.undo_stack.length - 1];
      if (last_stack == null || last_stack.text !== text) {
        this.undo_stack.push({ text, cursor_position });
      }
    },
    500,
    {
      leading: true,
      trailing: false
    }
  );

  getSnapshotBeforeUpdate(prevProps) {
    // if (this.shadowRoot.activeElement !== this._element) {
    //   return null;
    // }

    try {
      let previous_position = get_current_carret_position(
        this.shadowRoot,
        this._element
      );
      let next_cursor_position = this.next_cursor_position || previous_position;
      // TODO Clear next_cursor_position here?

      return {
        next_position: next_cursor_position || null,
        previous_position: previous_position
      };
    } catch (error) {
      return { next_position: null, previous_position: null };
    }
  }

  componentDidUpdate(
    prevProps,
    prevState,
    { next_position, previous_position }
  ) {
    if (prevProps.text !== this.props.text) {
      if (this.just_did_undo === true) {
        this.redo_stack.push({
          text: prevProps.text,
          cursor_position: previous_position
        });
        this.just_did_undo = false;
      } else {
        this.save_undo({
          text: prevProps.text,
          cursor_position: previous_position
        });

        if (this.just_did_redo === true) {
          this.just_did_redo = false;
        } else {
          this.redo_stack = [];
        }
      }
    }

    if (
      next_position != null &&
      this.shadowRoot.activeElement === this._element
    ) {
      var data = getCaretData(
        this._element,
        Math.max(0, next_position.start),
        Math.max(0, next_position.end)
      );
      setCaretPosition(this.shadowRoot, data);
      this.next_cursor_position = null;
    }
  }

  onPaste = event => {
    event.preventDefault();

    let pasted_text = event.clipboardData.getData("Text");

    let position = get_current_carret_position(this.shadowRoot, this._element);
    let { before, selected, after } = get_text_slices_from_carret(
      position,
      this.props.text
    );
    this.next_cursor_position = {
      start: position.start + pasted_text.length,
      end: position.start + pasted_text.length
    };
    this.onChange(`${before}${pasted_text}${after}`);
    // `${before}${pasted_text}${cursor}${after}`
  };

  onCut = event => {
    event.preventDefault();

    let position = get_current_carret_position(this.shadowRoot, this._element);
    let { before, selected, after } = get_text_slices_from_carret(
      position,
      this.props.text
    );

    event.clipboardData.setData("Text", selected);
    this.next_cursor_position = {
      start: position.start,
      end: position.start
    };
    this.onChange(`${before}${after}`);
    // `${before}${cursor}${after}`
  };

  onCopy = event => {
    event.preventDefault();
    let position = get_current_carret_position(this.shadowRoot, this._element);
    let { before, selected, after } = get_text_slices_from_carret(
      position,
      this.props.text
    );

    event.clipboardData.setData("Text", selected);
  };

  onChange(value) {
    let { text, cursor_position } =
      typeof value === "object"
        ? value
        : { text: value, cursor_position: this.next_cursor_position };

    // value = value.replace(/#\u{2060}{2}/gu, "###");
    // value = value.replace(/#\u{2060}/gu, "##");
    // value = value.replace(/\u{2060}/gu, "");

    if (text === this.props.text) {
      // No reason to call onChange, I guess?
      if (!cursor_position) {
        console.trace("No cursor position passed to onChange");
        return; // Should always have cursor_position?
      }
      var data = getCaretData(
        this._element,
        Math.max(0, cursor_position.start),
        Math.max(0, cursor_position.end)
      );
      setCaretPosition(this.shadowRoot, data);
    } else {
      this.props.onChange(text);
      this.next_cursor_position = cursor_position;
    }
  }

  _onKeyDown = ev => {
    if (
      ev.key === "ArrowRight" ||
      ev.key === "ArrowLeft" ||
      ev.key === "ArrowUp" ||
      ev.key === "ArrowDown"
    ) {
      return;
    }

    if (ev.metaKey) {
      if (ev.key === "a") return;
      if (ev.key === "c") return;
      if (ev.key === "v") return;
      if (ev.key === "x") return;
      if (ev.altKey) return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    let { multiline } = this.props;
    let position = get_current_carret_position(this.shadowRoot, this._element);
    let { before, selected, after } = get_text_slices_from_carret(
      position,
      this.props.text
    );

    if (ev.metaKey || ev.ctrlKey) {
      // Cmd + z for undo
      if (ev.key === "z") {
        let stack_item = ev.shiftKey
          ? this.redo_stack.pop()
          : this.undo_stack.pop();

        if (stack_item != null) {
          let { text, cursor_position } = stack_item;
          // let element = document.createElement("div");
          // ReactDOM.render(
          //   <TextEditor {...this.props} content={content} />,
          //   element
          // );
          // let text = element.innerText;

          if (ev.shiftKey) {
            this.just_did_redo = true;
          } else {
            this.just_did_undo = true;
          }
          this.onChange({ text, cursor_position });
        }
      }

      // Cmd + b for Bold
      if (ev.key === "b") {
        let value = `${before}*${selected}*${after}`;

        this.onChange({
          text: value,
          cursor_position:
            selected === ""
              ? {
                  start: position.start + 1,
                  end: position.start + 1
                }
              : {
                  start: position.start,
                  end: position.end + 2
                }
        });
      }

      // Cmd + i for Italic
      if (ev.key === "i") {
        // if (selected === "") {
        //   onChange(editor`${before}/${editor["☝"]}/${after}`);
        // } else {
        //   onChange(editor`${before}${editor["☝"]}/${selected}/${editor["☝"]}${after}`);
        // }

        let value = `${before}/${selected}/${after}`;
        this.onChange({
          text: value,
          cursor_position:
            selected === ""
              ? {
                  start: position.start + 1,
                  end: position.start + 1
                }
              : {
                  start: position.start,
                  end: position.end + 2
                }
        });
      }

      // Cmd + u for Underline
      if (ev.key === "u") {
        let value = `${before}_${selected}_${after}`;

        this.onChange({
          text: value,
          cursor_position:
            selected === ""
              ? {
                  start: position.start + 1,
                  end: position.start + 1
                }
              : {
                  start: position.start,
                  end: position.end + 2
                }
        });
      }
    } else {
      if (ev.key === "Backspace") {
        if (selected === "") {
          let { start, end } = getCaretData(
            this._element,
            position.start - 1,
            position.end - 1
          );
          let node =
            start.node.nodeType === 1 ? start.node : start.node.parentElement;
          let contenteditable_parent = get_parent(node, "[contenteditable]");
          let contenteditable = contenteditable_parent.getAttribute(
            "contenteditable"
          );

          if (contenteditable === "false") {
            let text = contenteditable_parent.innerText;
            this.onChange({
              text: `${before.slice(0, -text.length)}${after}`,
              cursor_position: {
                start: position.start - text.length,
                end: position.end - text.length
              }
            });
          } else {
            let indentationmatch = before.match(
              /(?:^|\n)(?: {2})*(?<spaces>  ?)$/
            );
            if (indentationmatch) {
              let spaces = indentationmatch.groups.spaces.length;
              this.onChange({
                text: `${before.slice(0, -spaces)}${selected}${after}`,
                cursor_position: {
                  start: position.start - spaces,
                  end: position.start - spaces
                }
              });
            } else {
              this.onChange({
                text: `${before.slice(0, -1)}${after}`,
                cursor_position: {
                  start: position.start - 1,
                  end: position.end - 1
                }
              });
            }
          }
        } else {
          this.onChange({
            text: `${before}${after}`,
            cursor_position: {
              start: position.start,
              end: position.start
            }
          });
        }
        return;
      }

      let surround_keys = {
        "'": "'",
        '"': '"',
        "(": ")",
        "`": "`",
        // _: "_",
        // "*": "*",
        "/": "/",
        "[": "]",
        "{": "}"
      };
      // TODO Place a "ghost character" after the selected when you type a "opening key".
      // .... Then when you type that character, it just fills it in.
      // .... if you type another character, your cursor just moves with the ghost character still after it
      // .... if you click away, or in another way remove focus, you fill the character in
      if (surround_keys[ev.key]) {
        let after_key = surround_keys[ev.key];

        if (selected !== "") {
          this.next_cursor_position = {
            start: position.start,
            end: position.end + 2
          };
          let value = `${before}${ev.key}${selected}${after_key}${after}`;
          this.onChange(value);
          return;
        }
      }

      if (ev.key === "Tab") {
        let lines_start_position = selected.startsWith("\n")
          ? before.length
          : Math.max(0, before.lastIndexOf("\n"));
        let lines_end_position = selected.endsWith("\n")
          ? 0
          : after.indexOf("\n");

        // prettier-ignore
        let lines = `${before.slice(lines_start_position)}${selected}${after.slice(0, lines_end_position)}`
        let indented_lines = ev.shiftKey
          ? lines.replace(/\n {2}/g, "\n")
          : lines.replace(/\n/g, "\n  ");
        before = before.slice(0, lines_start_position);
        after = after.slice(lines_end_position);

        this.next_cursor_position = {
          start:
            position.start +
            (ev.shiftKey ? (lines.startsWith("\n  ") ? -2 : 0) : 2),
          end: position.end + (indented_lines.length - lines.length)
        };
        this.onChange(`${before}${indented_lines}${after}`);
      }

      if (ev.key === "Enter") {
        if (multiline === false) {
          ev.currentTarget.blur();
          return;
        }

        let spaces = ev.shiftKey
          ? 0
          : before.match(/(?:^|\n)(?<spaces> *)[^\n]*$/).groups.spaces.length;

        let value = `${before}\n${" ".repeat(spaces)}${
          after === "" ? "\n" : after
        }`;

        this.next_cursor_position = {
          start: position.start + 1 + spaces,
          end: position.end - selected.length + 1 + spaces
        };
        this.onChange(value);
      }

      // TODO Another way if a key is "just" a character that would be inserted
      // .... eg no shortcut for any action, like Enter or Backspace
      if ([...ev.key].length === 1) {
        this.onChange({
          text: `${before}${ev.key}${after}`,
          cursor_position: {
            start: position.start + 1,
            end: position.start + 1
          }
        });
      } else {
      }
    }
  };

  render() {
    let { innerRef, content, editable, text, multiline, ...props } = this.props;

    if (typeof content === "string") {
      return (
        <div
          {...props}
          ref={ref => {
            this._element = ref;
            this.shadowRoot = get_shadow_root(ref);
            innerRef(ref);
          }}
          contentEditable={editable}
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={ev => {
            ev.preventDefault();
            throw new Error("onInput should not be called");
          }}
          onKeyDown={this._onKeyDown}
          onPaste={this.onPaste}
        />
      );
    } else {
      return (
        <div
          {...props}
          children={content}
          ref={ref => {
            this._element = ref;
            this.shadowRoot = get_shadow_root(ref);
            innerRef(ref);
          }}
          suppressContentEditableWarning
          contentEditable={editable}
          onInput={ev => {
            ev.preventDefault();
            throw new Error("onInput should not be called");
          }}
          onKeyDown={this._onKeyDown}
          onPaste={this.onPaste}
          onCut={this.onCut}
          onCopy={this.onCopy}
        />
      );
    }
  }
}

let get_shadow_root = element => {
  return element ? element.getRootNode() : document;
  // let parent = element;
  //
  // while (parent != null) {
  //   if (parent instanceof window.ShadowRoot) {
  //     return parent;
  //   }
  //   parent = parent.parentNode;
  // }
  // return document;
};
