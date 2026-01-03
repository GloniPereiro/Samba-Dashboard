import { useEffect, useState } from "react";
import List from "../Files/List";
import "./Zasoby.css";

export default function Zasoby() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/files", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        console.log("FILES FROM BACKEND:", data.files);


        setFiles(data.files || []);
      } catch (err) {
        console.error("Błąd pobierania plików:", err);
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = (file) => {
  const link = document.createElement("a");
  link.href = file.url; // backend musi zwracać URL
  link.download = file.name;
  link.click();
};

const handleRename = async (file) => {
  const newName = prompt("Nowa nazwa pliku:", file.name);
  if (!newName) return;

  // 1. Niedozwolone znaki
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(newName)) {
    alert("Nazwa zawiera niedozwolone znaki.");
    return;
  }

  // 2. Blokada nazw składających się z samych kropek
  if (/^\.+$/.test(newName)) {
    alert("Nazwa nie może składać się wyłącznie z kropek.");
    return;
  }

  // 3. Blokada wielu kropek w nazwie (poza rozszerzeniem)
  const dotCount = (newName.match(/\./g) || []).length;
  if (dotCount > 1) {
    alert("Nazwa nie może zawierać wielu kropek.");
    return;
  }

  // 4. Zachowanie rozszerzenia
  const ext = file.name.split(".").pop();
  const base = newName.replace(/\.[^/.]+$/, "").trim();

  if (!base) {
    alert("Nazwa nie może być pusta.");
    return;
  }

  const finalName = `${base}.${ext}`;

  try {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/files/${file._id}/rename`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ newName: finalName })
    });

    // 5. Aktualizacja TYLKO jednego pliku
    setFiles(prev =>
      prev.map(f =>
        f._id === file._id ? { ...f, name: finalName } : f
      )
    );

  } catch (err) {
    console.error("Błąd zmiany nazwy:", err);
  }
};



const handleDelete = async (file) => {
  if (!confirm(`Usunąć plik ${file.name}?`)) return;

  try {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/files/${file._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setFiles(prev => prev.filter(f => f._id !== file._id));
  } catch (err) {
    console.error("Błąd usuwania pliku:", err);
  }
};


  return (
    <div className="zasoby">
      <div className="legend">
        <div></div>
        <div className="legendText">nazwa</div>
        <div className="legendText">data</div>
        <div className="legendText">użytkownik</div>
        <div className="legendText">wielkosć</div>
        <div></div>
        <div></div>
      </div>  

      <List files={files} 
      onDownload={handleDownload}
        onRename={handleRename}
        onDelete={handleDelete} />
    </div>
  );
}

