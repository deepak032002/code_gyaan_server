const handleCreateTOC = (html: Document) => {
  const headings = html.querySelectorAll("h2, h3, h4, h5, h6");

  const toc = document.createElement("ul");
  toc.classList.add("toc");

  headings.forEach((heading) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.innerText = heading.innerHTML;
    a.href = `#${heading.id}`;
    li.appendChild(a);
    toc.appendChild(li);
  });

  return toc;
};

const handleParseHtml = (value: string) => {
  // Find all headings elements
  const html = new DOMParser().parseFromString(value, "text/html");
  const headings = html.querySelectorAll("h2, h3, h4, h5, h6");

  headings.forEach((heading) => {
    const id = Math.random().toString(36).substr(2, 9);
    heading.id = id;
    heading.outerHTML = heading.outerHTML;
  });

  return handleCreateTOC(html);
};
