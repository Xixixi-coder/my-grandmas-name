import html2canvas from 'html2canvas';

export const generateShareCard = async (elementId: string): Promise<string> => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
        clonedElement.style.transform = 'none';
        clonedElement.style.position = 'static';
      }
    }
  });

  return canvas.toDataURL('image/png', 1.0);
};

export const downloadImage = (dataUrl: string, filename?: string) => {
  const link = document.createElement('a');
  link.download = filename || `三代对比卡_${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
};

export const shareOrDownload = async (elementId: string): Promise<void> => {
  const imageUrl = await generateShareCard(elementId);

  if (navigator.share) {
    try {
      const blob = await fetch(imageUrl).then((r) => r.blob());
      const file = new File([blob], '三代对比卡.png', { type: 'image/png' });
      await navigator.share({
        title: '妈妈的妈妈叫什么名字',
        text: '我完成了三代女性的名字考古，来看看我的发现',
        files: [file]
      });
      return;
    } catch {
      // fall through to download
    }
  }

  downloadImage(imageUrl);
};
