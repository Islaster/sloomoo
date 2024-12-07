import { useEffect } from "react";
import "./form.css";
import { v4 as uuidv4 } from "uuid";

export default function SloomooForm({ setChangeScreen }) {
  const uniqueId = uuidv4();
  useEffect(() => {
    const scriptId = "pickaxe-script-Sloomos_Wish_WLCA4";

    // Generate a unique ID

    // Remove the existing script if it exists
    const removeExistingScript = () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };

    // Inject the new script dynamically
    const injectNewScript = () => {
      // Reset PICKAXE configuration
      window.PICKAXE = {
        pickaxes: [],
        style:
          "kHsjoCQGgI0GWASmgIdIAxiDA6wgM6CMbgC4UgDDAXYEAvDIBoGEBgG4CAWQIGYBgwCqApdoEjggjIaCcCoCA9gGzOBUToIQygtAyDw4IGoGgCkxAAC6AQCsAAD4BILgJ6AkV0ALDQAFA+YiAkjEDFLoEEywHkKgMCHAzVmBfPMBUIIAaXQC7ggIDFAilWBXGkAmVIFVJQAAigIDBAQvSAJLkAKIgHZAAGqAxiOAFRCArgmAQjSADFiACCIASoAACIBA+oAAeoBI8IAdGIAgEYAmCYAqaYAAIYAwboA2QYA/O4CuJYBLUIAWQYB8QoB2EIApJYAAg4BuaoA5NYBBPYB/e4AYCYBJOoCHgoBhi4Ajj4AzlICdc4B9eYClTYBUVYCJrYBjX4AvZ4Cbu4BFd4Avo4BMKoANpoAMSIBQFIDN3QDiADOAWOCAiFwAYIBAC4CIF4BgGIAIDIBQhIABYIAFHoBeKIAoWMAAOGAQApAAqogBMQgBYgGhdwAGAoAFxDygAL0QAwAYAgAcAnEaABoTAA4ugBIawDRQIBCUUAG4yAQR7ADM0gFJpQAAJYBxG0AqGiAMURAGJjgBaiwA7NoA+P0As6GASDJAAAxgCw0QAwVoBA2EAUUWAAk1AOKQgBUuQCpsoApJ8AJuKAUDRAAGhgGGCwD3AoBA+UAxMKASItAISZgAwUAAQgAD5QCACoAnqMAALuAdjhAAgCgC29QCBloAIbsAaAqASGBADdggDFYwAoM4A2akAqAqAVyBAF8GgArEQA2J4BhMbQgFBdAAUgAwAwCkwoAXK8AzWaAeCnALO5gAy+QBgYYAUZMASNKAGEpAGemgAAvwCdOYBhT8AUDOAZLLABirgAbCQBqg4AF9MAiYSAKtTAP1BgFjTQAkJIAggMADISAB3zALg8gHD4QAgdYAvjUAfHiAGSHAOvlgBkCQCub4AwhcAuJ2AG4JAKhZgBWcwBgIoAQUcAAIiAEFxAKEDgHUwwA0yIBiS0AOFbAAEIwBV4cAe6dAEiCwA+iUAXPtACCLwBxKkASdJABlmQBcb0ABoHAAEUgAAIA=",
      };
      window.PICKAXE.pickaxes.push({
        id: "Sloomos_Wish_WLCA4",
        type: "inline",
      });

      // Add the script to the document head
      const script = document.createElement("script");
      script.id = scriptId;

      script.innerHTML = `
        (function() {
          const { id } = window.PICKAXE.pickaxes[0];
          fetch(\`https://embed.pickaxeproject.com/axe/api/script/\${id}\`)
            .then((res) => res.json())
            .then(({ v }) => {
              const url = \`https://cdn.jsdelivr.net/gh/pickaxeproject/cdn@\${v}/dist\`;
              if (!document.querySelector(\`script[src="\${url}/bundle.js"]\`)) {
                const newScript = document.createElement("script");
                newScript.src = \`\${url}/bundle.js\`;
                newScript.defer = true;
                document.head.appendChild(newScript);
              }
            });
        })();
      `;
      script.defer = true;
      document.head.appendChild(script);
    };

    const observer = new MutationObserver(() => {
      const divs = document.querySelectorAll(
        ".pxe-flex.pxe-flex-col.pxe-gap-y-1"
      );

      if (divs.length >= 3) {
        const targetDiv = divs[2];

        // Apply hidden styles to the div
        targetDiv.style.visibility = "hidden";
        targetDiv.style.opacity = "0";
        targetDiv.style.position = "absolute";
        targetDiv.style.height = "0px";
        targetDiv.style.overflow = "hidden";
        targetDiv.style.zIndex = "-1";
      }
    });
    const divs = document.querySelectorAll(
      ".pxe-flex.pxe-flex-col.pxe-gap-y-1"
    );
setTimeout(()=>{
  const divs = document.querySelectorAll(
    ".pxe-flex.pxe-flex-col.pxe-gap-y-1"
  );

  if (divs.length >= 4) {
    const targetDiv = divs[2];
    const hiddenInput = targetDiv.querySelector("textarea");
    if (hiddenInput) {
      hiddenInput.value = uniqueId;
      console.log("name: ", divs[1].querySelector('textarea'));
      console.log('prompt: ', divs[3].querySelector('textarea'))
    }
  }
},2000)

    observer.observe(document.body, { childList: true, subtree: true });

    // Remove existing script and inject the new one
    removeExistingScript();
    injectNewScript();

    // Cleanup on component unmount
    return () => {
      removeExistingScript();
    };
  }, []);

  return (
    <>
      <section className="vh-100 vw-100">
        <div className="header-container">
          <div style={{ width: "100vw", height: "8vh" }}>
            <img
              src="/Drips_Master-01.png"
              alt="lildrip"
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="sloomoo-holiday-wish-header">
            SLOOMOO'S HOLIDAY WISH
          </div>
        </div>
        <section className="d-flex flex-column align-items-center justify-content-center p-2">
          <div className="form-card">
            <div id="pickaxe-inline-Sloomos_Wish_WLCA4"></div>
          </div>
        </section>
        <div>
          <footer className="mt-2">
            <a
              className="credit d-flex flex-column align-items-center justify-content-center"
              onClick={() => setChangeScreen("c")}
              style={{ cursor: "pointer" }}
            >
              credits
            </a>
          </footer>
        </div>
      </section>
    </>
  );
}
