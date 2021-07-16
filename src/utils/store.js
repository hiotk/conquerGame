
function getLocalStorage() {
    try {
        if ("localStorage" in window && null !== window.localStorage) return localStorage
    } catch (t) {
        return null
    }
    return null
}
export function saveJson(k, v) {
  var s = getLocalStorage();
  if (null !== s) {
      var a = JSON.stringify(v);
      s.setItem(k, a)
  }
}

export function loadJson(k) {
  var e = null;
  if (null === e || void 0 === e) {
      var i = getLocalStorage();
      if (null === i) return !1;
      e = JSON.parse(i.getItem(k))
  }
  return e
}
