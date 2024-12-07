import { useEffect } from "react";

export default function SloomooForm(){
  //pickaxe script tag
  useEffect(() => {
    // Adding the updated script dynamically
    const script = document.createElement("script");
    script.innerHTML = `
      window.PICKAXE = window.PICKAXE || {
        pickaxes: [],
        style: "kHsjoCQGgI0GWASmgIdIAxiDA6wgM6CMbgC4UgDDAXYEAvDIBoGEBgG4CAWQIGYBgwCqApdoEjggjIaCcCoCA9gGzOBUToIQygtAyDw4IGoGgCkxAAC6AQCsAAD4BILgJ6AkV0ALDQAFA+YiAkjEDFLoEEywHkKgMCHAzVmBfPMBUIIAaXQC7ggIDFAilWBXGkAmVIFVJQAAigIDBAQvSAJLkAKIgHZAAGqAxiOAFRCArgmAQjSADFiACCIASoAACIBA+oAAeoBI8IAdGIAgEYAmCYAqaYAAIYAwboA2QYA/O4CuJYBLUIAWQYB8QoB2EIApJYAAg4BuaoA5NYBBPYB/e4AYCYBJOoCHgoBhi4Ajj4AzlICdc4B9eYClTYBUVYCJrYBjX4AvZ4Cbu4BFd4Avo4BMKoANpoAMSIBQFIDN3QDiADOAWOCAiFwAYIBAC4CIF4BgGIAIDIBQhIABYIAFHoBeKIAoWMAAOGAQApAAqogBMQgBYgGhdwAGAoAFxDygAL0QAwAYAgAcAnEaABoTAA4ugBIawDRQIBCUUAG4yAQR7ADM0gFJpQAAJYBxG0AqGiAMURAGJjgBaiwA7NoA+P0As6GASDJAAAxgCw0QAwVoBA2EAUUWAAk1AOKQgBUuQCpsoApJ8AJuKAUDRAAGhgGGCwD3AoBA+UAxMKASItAISZgAwUAAQgAD5QCACoAnqMAALuAdjhAAgCgC29QCBloAIbsAaAqASGBADdggDFYwAoM4A2akAqAqAVyBAF8GgArEQA2J4BhMbQgFBdAAUgAwAwCkwoAXK8AzWaAeCnALO5gAy+QBgYYAUZMASNKAGEpAGemgAAvwCdOYBhT8AUDOAZLLABirgAbCQBqg4AF9MAiYSAKtTAP1BgFjTQAkJIAggMADISAB3zALg8gHD4QAgdYAvjUAfHiAGSHAOvlgBkCQCub4AwhcAuJ2AG4JAKhZgBWcwBgIoAQUcAAIiAEFxAKEDgHUwwA0yIBiS0AOFbAAEIwBV4cAe6dAEiCwA+iUAXPtACCLwBxKkASdJABlmQBcb0ABoHAAEUgAAIA="
      };
      window.PICKAXE.pickaxes.push({ id: "Sloomos_Wish_WLCA4", type: "inline" });
      const { id: _fid } = window.PICKAXE.pickaxes[0];
      fetch(\`https://embed.pickaxeproject.com/axe/api/script/\${_fid}\`)
        .then((e) => e.json())
        .then(({ v: e }) => {
          const t = \`https://cdn.jsdelivr.net/gh/pickaxeproject/cdn@\${e}/dist\`;
          if (!document.querySelector(\`script[src="\${t}/bundle.js"]\`)) {
            const e = document.createElement("script");
            e.src = t + "/bundle.js";
            e.defer = true;
            document.head.appendChild(e);
          }
        });
    `;
    script.defer = true;
    document.head.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  function handleClick(){ 
    
  }
  return(
    <div id="pickaxe-inline-Sloomos_Wish_WLCA4">
      {/* Add any fallback or loading content if needed */}
    </div>
  )
}