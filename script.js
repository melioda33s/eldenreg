const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const runBtn = document.getElementById("runBtn");

let uploadedFile = null;

dropZone.onclick = () => fileInput.click();

fileInput.onchange = (event) => {

    uploadedFile = event.target.files[0];

    dropZone.textContent = uploadedFile.name;
};

dropZone.ondragover = (event) => {

    event.preventDefault();
    dropZone.classList.add("dragover");
};

dropZone.ondragleave = () => {

    dropZone.classList.remove("dragover");
};

dropZone.ondrop = (event) => {

    event.preventDefault();
    dropZone.classList.remove("dragover");

    uploadedFile = event.dataTransfer.files[0];
    fileInput.files = event.dataTransfer.files;

    dropZone.textContent = uploadedFile.name;
};

runBtn.onclick = async () => {

    if(!uploadedFile){
        alert("Upload memory.dat or ER0000.sl2 first");
        return;
    }

    const filename = uploadedFile.name;
    const uploadedBuffer = await uploadedFile.arrayBuffer();
    const uploadedBytes = new Uint8Array(uploadedBuffer);
    const ps4_reg_start = 0x1960070;
    const pc_reg_start = 0x19603C0;

    let merged;
    let output_name;

    if(filename === "memory.dat"){

    const response = await fetch("ER0000.sl2");
    const pcBuffer = await response.arrayBuffer();
    const pcBytes = new Uint8Array(pcBuffer);

    const pc_reg = pcBytes.slice(pc_reg_start);

    merged = new Uint8Array(ps4_reg_start + pc_reg.length);

    merged.set(uploadedBytes.slice(0, ps4_reg_start),0);
    merged.set(pc_reg, ps4_reg_start);

    output_name = "memory.dat";
}

    else if(filename === "ER0000.sl2"){

    const response = await fetch("ER0000.sl2");
    const pcBuffer = await response.arrayBuffer();
    const pcBytes = new Uint8Array(pcBuffer);

    const pc_reg = pcBytes.slice(pc_reg_start);

    merged = new Uint8Array(pc_reg_start + pc_reg.length);

    merged.set(uploadedBytes.slice(0, pc_reg_start),0);
    merged.set(pc_reg, pc_reg_start);

    output_name = "ER0000.sl2";
}

    else{
        alert("Error: Upload memory.dat or ER0000.sl2");
        return;
    }

    const blob = new Blob([merged]);

    const download = document.createElement("a");

    download.href = URL.createObjectURL(blob);
    download.download = output_name;

    download.click();
};