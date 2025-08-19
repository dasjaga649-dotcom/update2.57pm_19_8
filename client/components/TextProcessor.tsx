import React from 'react';
import DOMPurify from 'dompurify';
import { ImageWithFallback } from './ImageWithFallback';

interface TableData {
  title: string;
  headers: string[];
  rows: string[][];
}

interface TextProcessorProps {
  content: string;
  isDarkMode?: boolean;
  className?: string;
  tables?: TableData[];
}

interface ProcessedContent {
  formattedContent: React.ReactElement;
  extractedImages: Array<{ url: string; alt: string }>;
}

export const TextProcessor: React.FC<TextProcessorProps> = ({ 
  content, 
  isDarkMode = false, 
  className = '',
  tables = []
}) => {
  const processedContent = React.useMemo(() => processContent(content, isDarkMode, tables), [content, isDarkMode, tables]);

  return (
    <div className={`text-processor ${className}`}>
      {processedContent.formattedContent}
    </div>
  );
};

const processContent = (content: string, isDarkMode: boolean = false, tables: TableData[] = []): ProcessedContent => {
  const extractedImages: Array<{ url: string; alt: string }> = [];
  let processedContent = content;

  // 1. Extract images first with alt text
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let imageMatch;
  while ((imageMatch = imageRegex.exec(content)) !== null) {
    extractedImages.push({
      url: imageMatch[2],
      alt: imageMatch[1] || 'Image'
    });
  }

  // Extract regular image URLs that aren't in markdown format
  const urlImageRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?)/gi;
  let urlImageMatch;
  while ((urlImageMatch = urlImageRegex.exec(content)) !== null) {
    const imageUrl = urlImageMatch[1];
    if (!extractedImages.some(img => img.url === imageUrl)) {
      extractedImages.push({
        url: imageUrl,
        alt: 'Image'
      });
    }
  }

  // Remove extracted images from content to avoid duplicate rendering
  processedContent = processedContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '');

  // Remove standalone image URLs that we've extracted
  extractedImages.forEach(img => {
    processedContent = processedContent.replace(new RegExp(img.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  });

  // 2. Process table placeholders and create table elements
  const tablePlaceholderRegex = /(-*)\[TABLE:([^\]]+)\](-*)/g;
  let tableMatch;
  const tableElements: React.ReactElement[] = [];
  const tableMap: { [key: string]: number } = {};

  while ((tableMatch = tablePlaceholderRegex.exec(processedContent)) !== null) {
    const beforeDashes = tableMatch[1] || '';
    const tableName = tableMatch[2];
    const afterDashes = tableMatch[3] || '';
    const tableData = tables.find(table => table.title === tableName);
    
    if (tableData) {
      const tableIndex = tableElements.length;
      tableMap[`TABLE_${tableIndex}`] = tableIndex;
      tableElements.push(renderTable(tableData, isDarkMode, beforeDashes, afterDashes, tableIndex));
    }
  }

  // Replace table placeholders with unique markers
  let tableIndex = 0;
  processedContent = processedContent.replace(tablePlaceholderRegex, (match, beforeDashes, tableName, afterDashes) => {
    const tableData = tables.find(table => table.title === tableName);
    if (tableData) {
      return `---TABLE_${tableIndex++}---`;
    }
    return '';
  });

  // 3. Handle standalone horizontal lines (---)
  processedContent = processedContent.replace(/^---+$/gm, '---HR_LINE---');

  // 4. Detect SPECIFIC keyword patterns and add animated icons
  // Only match patterns like "Address:", "Phone:", "Email:", etc. (with colon)
  const keywordPatterns = [
    { 
      pattern: /\b(phone|tel|telephone|call|mobile|cell)(\s*:)/gi, 
      icon: '📞', 
      animation: 'animate-iconBounce' 
    },
    { 
      pattern: /\b(email|mail|e-mail)(\s*:)/gi, 
      icon: '✉️', 
      animation: 'animate-iconPulse' 
    },
    { 
      pattern: /\b(address|location|street|avenue|road|place)(\s*:)/gi, 
      icon: '📍', 
      animation: 'animate-iconBounce' 
    },
    { 
      pattern: /\b(website|web|site|url|www)(\s*:)/gi, 
      icon: '🌐', 
      animation: 'animate-iconPulse' 
    }
  ];

  keywordPatterns.forEach(({ pattern, icon, animation }) => {
    processedContent = processedContent.replace(pattern, (match, keyword, colon) => {
      return `<span class="${animation} inline-block mr-1">${icon}</span>${keyword}${colon}`;
    });
  });

  // 5. Convert markdown to HTML
  processedContent = convertMarkdownToHtml(processedContent, isDarkMode);

  // 6. Clean up extra whitespace
  processedContent = processedContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  // 7. Build the final React element with proper content flow
  const formattedContent = buildCohesiveReactElement(processedContent, isDarkMode, tableElements);

  return {
    formattedContent,
    extractedImages
  };
};

const renderTable = (table: TableData, isDarkMode: boolean, beforeDashes: string, afterDashes: string, index: number) => {
  return (
    <div key={`table-${index}`} className="my-6">
      {/* Horizontal line before */}
      {beforeDashes && (
        <hr className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} mb-4`} />
      )}
      
      {/* Table title */}
      <h3 className={`text-lg font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {table.title}
      </h3>
      
      {/* Table with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className={`w-full border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <thead>
            <tr className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              {table.headers.map((header, headerIndex) => (
                <th 
                  key={headerIndex} 
                  className={`font-bold text-left border-r last:border-r-0 px-4 py-3 ${
                    isDarkMode 
                      ? 'text-gray-200 border-gray-600' 
                      : 'text-gray-900 border-gray-300'
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`
                  ${rowIndex % 2 === 0 
                    ? (isDarkMode ? 'bg-gray-900' : 'bg-white') 
                    : (isDarkMode ? 'bg-gray-800' : 'bg-gray-50')
                  } 
                  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} 
                  transition-colors
                `}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className={`border-r last:border-r-0 px-4 py-3 ${
                      isDarkMode 
                        ? 'text-gray-100 border-gray-600' 
                        : 'text-gray-700 border-gray-300'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Horizontal line after */}
      {afterDashes && (
        <hr className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} mt-4`} />
      )}
    </div>
  );
};

const convertMarkdownToHtml = (content: string, isDarkMode: boolean): string => {
  let htmlContent = content;
  
  // Convert markdown-style formatting to HTML
  // Bold: **text** or __text__
  htmlContent = htmlContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  htmlContent = htmlContent.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Italic: *text* or _text_ (but not when surrounded by other characters)
  htmlContent = htmlContent.replace(/(?<!\w)\*(.*?)\*(?!\w)/g, '<em>$1</em>');
  htmlContent = htmlContent.replace(/(?<!\w)_(.*?)_(?!\w)/g, '<em>$1</em>');
  
  // Code: `text`
  htmlContent = htmlContent.replace(/`(.*?)`/g, `<code class="px-1 py-0.5 rounded text-sm font-mono ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}">$1</code>`);
  
  // Headers
  htmlContent = htmlContent.replace(/^### (.*$)/gm, `<h3 class="text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}">$1</h3>`);
  htmlContent = htmlContent.replace(/^## (.*$)/gm, `<h2 class="text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}">$1</h2>`);
  htmlContent = htmlContent.replace(/^# (.*$)/gm, `<h1 class="text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}">$1</h1>`);
  
  // Links: [text](url)
  htmlContent = htmlContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" class="${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline font-medium transition-colors duration-200">$1</a>`);
  
  return htmlContent;
};

const buildCohesiveReactElement = (content: string, isDarkMode: boolean, tableElements: React.ReactElement[]): React.ReactElement => {
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-700';
  const strongClass = isDarkMode ? 'text-white' : 'text-gray-900';
  
  // Split content by table and HR markers
  const parts = content.split(/(---TABLE_\d+---|---HR_LINE---)/);
  const elements: React.ReactNode[] = [];
  let tableIndex = 0;

  parts.forEach((part, index) => {
    if (part.startsWith('---TABLE_')) {
      // Insert table
      if (tableIndex < tableElements.length) {
        elements.push(tableElements[tableIndex]);
        tableIndex++;
      }
    } else if (part === '---HR_LINE---') {
      // Insert HR
      elements.push(
        <hr key={`hr-${index}`} className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} my-4`} />
      );
    } else if (part.trim()) {
      // Process text content as cohesive HTML
      const htmlContent = part.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
      const wrappedContent = htmlContent.includes('<') ? htmlContent : `<p>${htmlContent}</p>`;
      
      // Sanitize the HTML
      const sanitizedHTML = DOMPurify.sanitize(wrappedContent, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
          'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        ALLOW_DATA_ATTR: false
      });
      
      elements.push(
        <div 
          key={`content-${index}`} 
          className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''} ${textClass} [&_strong]:${strongClass.replace('text-', '')} [&_b]:${strongClass.replace('text-', '')} leading-relaxed break-words overflow-wrap-anywhere`}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      );
    }
  });

  return <div className="space-y-4">{elements}</div>;
};

export { processContent };
export default TextProcessor;
