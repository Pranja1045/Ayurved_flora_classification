import React from "react";

function ReadableResponse(text) {
  // Define the terms to highlight
  const highlightTerms = [
    "Kingdom",
    "Phylum",
    "Class",
    "Genus",
    "Order",
    "Family",
    "Species",
    "Common Name",
    "Description",
    "Medical Uses",
  ];

  // Split the text into parts based on key points, paragraph headings, and brief descriptions
  const parts = text.split(
    /(\d\.\s.*?:|\n\nParagraph:|\*\*Brief Description:\*\*|Kingdom|Phylum|Class|Genus|Order|Family|Species|Common Name|Description|Medical Uses)/g
  );

  return (
    <div>
      {parts.map((part, index) => {
        // Highlight specific terms
        if (highlightTerms.includes(part.trim())) {
          return (
            <div key={index} className="my-2">
              <div>
                <span className="font-bold text-yellow-500">{part.trim()}</span>
                <div className="ml-4">
                  {parts[index + 1] ? <p>{parts[index + 1].trim()}</p> : null}
                </div>
              </div>
            </div>
          );
        }

        if (index % 2 === 1) {
          if (part.startsWith("•")) {
            // Handle bullet points
            return (
              <div key={index} className="my-2">
                <div>
                  <span className="font-bold text-yellow-500">
                    {part.trim()}
                  </span>
                  <div className="ml-4">
                    {parts[index + 1] ? <p>{parts[index + 1].trim()}</p> : null}
                  </div>
                </div>
              </div>
            );
          }

          // Default case for other key points
          return (
            <div key={index} className="my-2">
              <div>
                <span className="font-bold text-yellow-500">
                  • {part.replace(/\*\*/g, "").trim()}
                </span>
                <div className="ml-4">
                  {parts[index + 1] ? <p>{parts[index + 1].trim()}</p> : null}
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default ReadableResponse;
