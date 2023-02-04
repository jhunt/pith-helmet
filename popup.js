(() => {
  const summarize = async head => {
    const sectionTemplate = document.querySelector('template#section');
    const kvTemplate = document.querySelector('template#kv');

    const empty = e => {
      while (e && e.firstChild) { e.removeChild(e.firstChild); }
      return e;
    };

    const main = document.querySelector('main');
    const populate = (title, data, url) => {
      if (Object.entries(data).length == 0) {
        return;
      }
      console.log('populating %s with ', title, data);
      const section = sectionTemplate.content.cloneNode(true);
      empty(section.querySelector('h2'))
        .appendChild(document.createTextNode(title));

      const tbody = empty(section.querySelector('tbody'));
      for (k in data) {
        const kv = kvTemplate.content.cloneNode(true);
        kv.querySelector('td.k').appendChild(document.createTextNode(k));
        const ul = empty(kv.querySelector('ul'));
        (Array.from(data[k])).forEach(d => {
          const li = document.createElement('li');
          li.appendChild(document.createTextNode(d));

          if (d.match(/\.(jpe?g|png)$/)) {
            let img = document.createElement('img');

            // local url
            if (!d.match(/^https?:\/\//)) {

              let u = new URL(url);
              if (d.match(/^\//)) { // absolute url
                u.pathname = d
              } else { // relative url
                u.pathname += d
              }
              d = u.toString();
            }
            img.setAttribute('src', d);
            li.appendChild(img);
          }
          ul.appendChild(li);
        });
        tbody.appendChild(kv);
      }

      main.appendChild(section);
    }

    populate('Document', head.doc, head.url);
    populate('Metadata', head.meta, head.url);
    populate('RDFa (prop)', head.prop, head.url);
    populate('User-defined', head.user, head.url);
    populate('Links', head.link, head.url);
    populate('HTTP Equivalent', head.http, head.url);
    empty(document.body.querySelector('h1'));
  }

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }).then(async ([tab]) => {
    const r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['harvest.js'],
    });

    head = r[0].result
    await summarize(head)
  });
})();
