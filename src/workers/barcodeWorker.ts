import { BrowserMultiFormatReader } from '@zxing/library';

self.onmessage = async (e) => {
  const reader = new BrowserMultiFormatReader();
  try {
    const result = await reader.decodeFromImage(e.data);
    self.postMessage(result.text);
  } catch (error) {
    self.postMessage(null);
  }
};