console.log('tint-image');

let find_and_replace_alpha = color => {
  let match = null;
  if (
    (match = color
      .replace(/ /g, "")
      .match(/^(rgba?\([^,]+,[^,]+,[^,]+,)([^,]+)(\))$/))
  ) {
    let [fullmatch, before, transparency, after] = match;
    let alpha = Number(transparency);
    if (!Number.isNaN(alpha)) {
      return {
        color: `${before}1${after}`,
        alpha: alpha
      };
    } else {
      return { color, alpha: 1 };
    }
  } else if (
    (match = color.replace(/ /g, "").match(/^(#\d\d\d\d\d\d)(\d\d)$/))
  ) {
    let [fullmatch, before, transparency] = match;
    let alpha = Number(`0x${transparency}`) / 255;
    if (!Number.isNaN(alpha)) {
      return {
        color: `${before}`,
        alpha: alpha
      };
    } else {
      return { color, alpha: 1 };
    }
  } else {
    return { color, alpha: 1 };
  }
};

let color_icon_cache = new Map();
export let tint_image = (url, color) => {
  let identifier = `${url}@${color}`;
  if (color_icon_cache.has(identifier)) {
    return color_icon_cache.get(identifier);
  } else {
    let icon = _color_icon(url, color);
    color_icon_cache.set(identifier, icon);
    return icon;
  }
};

let load_image = async (url) => {
  let image = new Image();
  image.src = url;
  await new Promise((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject();
  });
  return image;
}

let _color_icon = async (url, _color) => {
  let { color, alpha } = find_and_replace_alpha(_color);

  let foreground = await load_image(url);

  let canvas = document.createElement("canvas");
  canvas.width = foreground.width;
  canvas.height = foreground.height;

  // Initaliase a 2-dimensional drawing context
  let ctx = canvas.getContext("2d");
  let width = ctx.canvas.width;
  let height = ctx.canvas.height;

  // create offscreen buffer,
  let buffer = document.createElement("canvas");
  buffer.width = foreground.width;
  buffer.height = foreground.height;

  let bx = buffer.getContext("2d");
  // fill offscreen buffer with the tint color
  bx.fillStyle = color;
  bx.fillRect(0, 0, buffer.width, buffer.height);
  // destination atop makes a result with an alpha channel identical to foreground, but with all pixels retaining their original color *as far as I can tell*
  bx.globalCompositeOperation = "destination-atop";
  bx.drawImage(foreground, 0, 0);

  // to tint the image, draw it first
  ctx.drawImage(foreground, 0, 0);
  ctx.drawImage(buffer, 0, 0);

  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "copy";
  ctx.drawImage(canvas, 0, 0, width, height);
  ctx.globalAlpha = 1.0;

  return ctx.getImageData(0, 0, width, height);
};
