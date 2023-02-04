(() => {
  const set = (h,k,v) => {
    if (!(k in h)) { h[k] = []; }
    h[k].push(v);
  };

  const head = {
    url:  document.location.href,
    doc:  {}, /* document metadata   */
    http: {}, /* meta http-equiv=... */
    meta: {}, /* meta name=...       */
    prop: {}, /* meta property=...   */
    user: {}, /* meta itemprop=...   */
    link: {}  /* link href=...       */
  };
  const setmeta = (what, meta, attr) => {
    let k = meta.getAttribute(attr);
    if (k) {
      set(what, k, meta.getAttribute('content'));
    }
  };

  const setdoc = (meta, attr) => {
    let v = meta.getAttribute(attr);
    if (v) {
      head.doc[attr] = [v]; // simulate array of 1 element
    }
  }

  document.querySelectorAll('head meta').forEach(meta => {
    setmeta(head.meta, meta, 'name');
    setmeta(head.prop, meta, 'property');
    setmeta(head.user, meta, 'itemprop');
    setmeta(head.http, meta, 'http-equiv');

    setdoc(meta, 'author');
    setdoc(meta, 'charset');
    setdoc(meta, 'description');
  });

  let title = document.querySelector('head title');
  if (title) {
    set(head.doc, 'title', title.innerText);
  }

  document.querySelectorAll('head link').forEach(link => {
    let rel = link.getAttribute('rel');
    if (rel) {
      if (!(rel in head.link)) {
        head.link[rel] = [];
      }
      head.link[rel].push(link.getAttribute('href'));
    }
  });
  return head;
})();
