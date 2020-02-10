import React from "react";
import { debounce } from "lodash";

// This properly keeps the returned callback the same,
// even if the "dependencies" of `fn` change.
// I do get why the React team hasn't added this yet,
// as if this is used for something other than a actual event callback, it screws things up.
export let useEventHandler = fn => {
  let actual_fn = React.useRef(fn);

  // handle_fn will never change, always be the same
  // thing pointing to `actual_fn.current` (which will change)
  let handle_fn = React.useRef((...args) => actual_fn.current(...args));

  React.useEffect(() => {
    actual_fn.current = fn;
  });

  return handle_fn.current;
};

export let useDispose = (value, onDispose) => {
  let last = React.useRef(value);

  if (last.current !== value) {
    onDispose(last.current);
  }

  last.current = value;
};

export let useDebouncedValue = (parent_value, delay = 1000) => {
  let [debounced_value, set_debounced_value] = React.useState(parent_value);

  // With `React.useCallback` here,
  // the previous counter will always show `0`...
  // So yeah you need useEventHandler
  let handle_save = useEventHandler(async () => {
    set_debounced_value(parent_value);
  });

  let debounce_ref = React.useRef();
  React.useEffect(() => {
    debounce_ref.current = debounce(handle_save, delay);
    return () => debounce_ref.current.flush();
  }, []);

  React.useEffect(() => {
    debounce_ref.current(parent_value);
  }, [parent_value]);

  return [debounced_value];
};
