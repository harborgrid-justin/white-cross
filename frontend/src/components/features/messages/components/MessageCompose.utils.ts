export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const insertTextAtCursor = (
  content: string,
  start: number,
  end: number,
  before: string,
  after: string = ''
): { newContent: string; newCursorPos: number } => {
  const selectedText = content.slice(start, end);
  const newText = before + selectedText + after;
  const newContent = content.slice(0, start) + newText + content.slice(end);
  const newCursorPos = start + before.length + selectedText.length + after.length;

  return { newContent, newCursorPos };
};
