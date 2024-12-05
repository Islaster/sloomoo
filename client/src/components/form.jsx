import { useEffect } from "react";

export default function SloomooForm(){
  useEffect(() => {
    // Adding the script dynamically
    const script = document.createElement('script');
    script.innerHTML = `
      window.PICKAXE = window.PICKAXE || { pickaxes: [], style: "kHsjoCQGgI0GWASmgIdIAxiDA6wgM6CMbgC4UgDDAXYEAvDIBoGEBgG4CAWQIGYBgwCqApdoEjggjIaCcCoCA9gGzOBUToIQygtAyDw4IGoGgCkxAAC6AQCsAAD4BILgJ6AkV0ALDQAFA+YiAkjEDFLoEEywHkKgMCHAzVmBfPMBUIIAaXQC7ggIDFAilWBXGkAmVIFVJQAAigIDBAQvSAJLkAKIgHZAAGqAxiOAFRCArgmAQjSADFiACCIASoAACIBA+oAAeoBI8IAdGIAgEYAmCYAqaYAAIYAwboA2QYA/O4CuJYBLUIAWQYB8QoB2EIApJYAAg4BuaoA5NYBBPYB/e4AYCYBJOoCHgoBhi4Ajj4AzlICdc4B9eYClTYBUVYCJrYBjX4AvZ4Cbu4BFd4Avo4BMKoANpoAMSIBQFIDN3QDiADOAWOCAiFwAYIBAC4CIF4BgGIAIDIBQhIABYIAFHoBeKIAoWMAAOGAQApAAqogBMQgBYgGhdwAGAoAFxDygAL0QAwAYAgAcAnEaABoTAA4ugBIawDRQIBCUUAG4yAQR7ADM0gFJpQAAJYBxG0AqGiAMURAGJjgBaiwA7NoA+P0As6GASDJAAAxgCw0QAwVoBA2EAUUWAAk1AOKQgBUuQCpsoApJ8AJuKAUDRAAGhgGGCwD3AoBA+UAxMKASItAISZgAwUAAQgAD5QCACoAnqMAALuAdjhAAgCgC29QCBloAIbsAaAqASGBADdggDFYwAoM4A2akAqAqAVyBAF8GgArEQA2J4BhMbQgFBdAAUgAwAwCkwoAXK8AzWaAeCnALO5gAy+QBgYYAUZMASNKAGEpAGemgAAvwCdOYBhT8AUDOAZLLABirgAbCQBqg4AF9MAiYSAKtTAP1BgFjTQAkJIAggMADISAB3zALg8gHD4QAgdYAvjUAfHiAGSHAOvlgBkCQCub4AwhcAuJ2AG4JAKhZgBWcwBgIoAQUcAAIiAEFxAKEDgHUwwA0yIBiS0AOFbAAEIwBV4cAe6dAEiCwA+iUAXPtACCLwBxKkASdJABlmQBcb0ABoHAAEUgAAIA=" };
      window.PICKAXE.pickaxes.push({ id: "Sloomos_Wish_WLCA4", type: "inline" });
      if (window.PICKAXE.pickaxes.length) {
        const { id } = window.PICKAXE.pickaxes[0];
        const _fid = id;
        fetch(\`https://embed.pickaxeproject.com/axe/api/script/\${_fid}\`)
          .then((e) => e.json())
          .then(({ v }) => {
            const t = \`https://cdn.jsdelivr.net/gh/pickaxeproject/cdn@\${v}/dist\`;
            if (!document.querySelector(\`script[src="\${t}/bundle.js"]\`)) {
              const script = document.createElement("script");
              script.src = t + "/bundle.js";
              script.defer = true;
              document.head.appendChild(script);
            }
          });
      }
    `;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    }
  }, []);
  return(
    <div id="pickaxe-inline-Sloomos_Wish_WLCA4">
      {/* Add any fallback or loading content if needed */}
    </div>
  )
}