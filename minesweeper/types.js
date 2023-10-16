if ("content" in document.createElement("template")) {
    const cellTemplate = document.getElementById("cell-template");

    class MinefieldCell extends HTMLElement {
        static cells = 0;

        constructor() {
            super();
        }

        connectedCallback() {
            MinefieldCell.cells++;
            const clone = cellTemplate.content.cloneNode(true);
            const div = clone.children[0];
            div.setAttribute("data-cell", String(MinefieldCell.cells));
            const button = div.children[0];
            button.addEventListener("click", e => {
                e.target.setAttribute("disabled", true);
            });

            // const shadow = this.attachShadow({ mode: "open" });
            this.appendChild(clone);
        }

        disconnectedCallback() {
            MinefieldCell.cells--;
        }
    }

    customElements.define("minefield-cell", MinefieldCell);
}
else {
    console.error("HTML Templates are not supported");
}
