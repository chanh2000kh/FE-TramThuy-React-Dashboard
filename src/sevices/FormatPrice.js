export default function format(n) {
  return n.toFixed(0).replace(/./g,  (c, i, a) => {
    return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? `.${c}` : c;
  });
}
