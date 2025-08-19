import React from 'react';
import { TextProcessor } from './TextProcessor';

const TableTestComponent = () => {
  const imageAndTableContent = `
# Image and Table Test

## Images should be extracted and shown in slideshow:

![Company Logo](https://via.placeholder.com/150x75/333333/ffffff?text=Company+Logo)

![Team Photo](https://via.placeholder.com/400x200/0066cc/ffffff?text=Team+Photo)

![Office Building](https://via.placeholder.com/300x200/009966/ffffff?text=Office+Building)

## Contact Information with animated icons:
Phone: +1 (555) 123-4567
Email: contact@company.com  
Address: 123 Main Street, New York, NY 10001
Website: https://www.company.com

---

## Employee Data Table:

[TABLE:Employee Information]

---

**More images to test extraction:**

![Dashboard](https://via.placeholder.com/500x300/663399/ffffff?text=Dashboard)

![Mobile App](https://via.placeholder.com/200x400/cc6600/ffffff?text=Mobile+App)

Text with **bold formatting** and *italic text*.

Code example: \`npm run dev\`

### Table with dashes:

---[TABLE:Sales Data]---

Regular link should work: [Visit our website](https://example.com)
  `;

  const sampleTables = [
    {
      title: "Employee Information",
      headers: ["Name", "Department", "Position", "Years"],
      rows: [
        ["John Doe", "Engineering", "Senior Developer", "5"],
        ["Jane Smith", "Marketing", "Manager", "3"],
        ["Bob Johnson", "Sales", "Representative", "2"],
        ["Alice Brown", "HR", "Specialist", "4"]
      ]
    },
    {
      title: "Sales Data", 
      headers: ["Quarter", "Revenue", "Growth", "Target"],
      rows: [
        ["Q1 2024", "$125,000", "12%", "$115,000"],
        ["Q2 2024", "$138,000", "15%", "$130,000"],
        ["Q3 2024", "$151,000", "18%", "$145,000"],
        ["Q4 2024", "$162,000", "20%", "$160,000"]
      ]
    }
  ];

  const keywordOnlyContent = `
# Keyword Detection Test

## Should show animated icons (with colons):
Phone: +1-555-123-4567
Email: info@company.com
Address: 123 Business Ave
Website: www.company.com

## Should NOT show icons (no colons):
Our phone system is modern.
Please email us for support.
The office address is downtown.
Visit our website regularly.
  `;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-4">Complete TextProcessor Test</h1>
      
      {/* Image and Table Test */}
      <div className="border rounded-lg p-4 bg-white">
        <h2 className="text-lg font-semibold mb-4">Images + Tables + Keywords (Light Mode)</h2>
        <p className="text-sm text-gray-600 mb-4">
          Images should be extracted and shown in slideshow below the content. Tables should render properly.
        </p>
        <TextProcessor 
          content={imageAndTableContent}
          isDarkMode={false}
          tables={sampleTables}
        />
      </div>

      <div className="border rounded-lg p-4 bg-gray-900">
        <h2 className="text-lg font-semibold mb-4 text-white">Images + Tables + Keywords (Dark Mode)</h2>
        <p className="text-sm text-gray-400 mb-4">
          Images should be extracted and shown in slideshow below the content. Tables should render properly.
        </p>
        <TextProcessor 
          content={imageAndTableContent}
          isDarkMode={true}
          tables={sampleTables}
        />
      </div>

      {/* Keyword Only Test */}
      <div className="border rounded-lg p-4 bg-white">
        <h2 className="text-lg font-semibold mb-4">Precise Keyword Detection (Light Mode)</h2>
        <TextProcessor 
          content={keywordOnlyContent}
          isDarkMode={false}
        />
      </div>

      <div className="border rounded-lg p-4 bg-gray-900">
        <h2 className="text-lg font-semibold mb-4 text-white">Precise Keyword Detection (Dark Mode)</h2>
        <TextProcessor 
          content={keywordOnlyContent}
          isDarkMode={true}
        />
      </div>
    </div>
  );
};

export default TableTestComponent;
