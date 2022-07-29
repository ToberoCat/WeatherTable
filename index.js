let lastDragged = null;

function createDragables() {
    const container = document.getElementById("symbol-container");
}

function createDropables() {
    const container = document.getElementById("empty-cells");
    container.childNodes.forEach(node => {
        node.addEventListener("drop", e => {
            if (e.target.childNodes.length >= 3) {
                alert("Es sind nur drei Symbole erlaubt");
                return;
            }
            e.preventDefault();
            let data = e.dataTransfer.getData("text");
            console.log(data);

            const icon = document.createElement("img");
            icon.setAttribute("src", data);
            icon.width = 96;
            icon.height = 96;

            icon.addEventListener("drag", e => lastDragged = icon);

            e.target.appendChild(icon);
        });
        node.addEventListener("dragover", e => e.preventDefault());
    });
}

function createGarbageCan() {
    const can = document.getElementById("garbage-can");

    can.addEventListener("dragover", e => e.preventDefault());
    can.addEventListener("drop", e => {
        if (lastDragged == null) return;
        lastDragged.remove();
        lastDragged = null;
    });
}

async function printToPdf() {
    const body = [
        ["6:00", "9:00", "12:00", "15:00", "18:00", "21:00", "0:00", "3:00"],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
    ];

    for (let i = 0; i < 8; i++) {
        const row = document.getElementById(`cell-${i}`);

        let counter = 1;
        for (const node of row.childNodes) {
            const svg = await svgToPath(node.getAttribute("src"));
            counter++;

            console.log(i);
            body[counter][i] = {
              svg: svg,
              width: 96
            };
        }
    }

    for (let i = 1; i < 4; i++) {
        const row = body[i];
        while (row.length < 8) row.push(" ");
    }

    console.log(body);

    pdfMake.createPdf({
        defaultFileName: "weather-data.pdf",
        content: [
            {
                layout: 'headerLineOnly', // optional
                table: {
                    headerRows: 1,
                    widths: [50, 50, 50, 50, 50, 50, 50, 50],

                    body: body
                }
            }
        ]
    }).open();
}

async function svgToPath(url) {
    return await fetch(url).then(response => response.text())
}

