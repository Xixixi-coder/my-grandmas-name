export const validateChineseName = (name: string): { valid: boolean; message?: string } => {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, message: '请输入名字' };
  }

  if (trimmed.length < 2) {
    return { valid: false, message: '名字至少需要2个字符' };
  }

  if (trimmed.length > 10) {
    return { valid: false, message: '名字不超过10个字符' };
  }

  return { valid: true };
};

export const validateBirthYear = (year: number | undefined): { valid: boolean; message?: string } => {
  if (year === undefined) return { valid: true };

  if (year < 1900 || year > new Date().getFullYear()) {
    return { valid: false, message: '请输入合理的出生年份' };
  }

  return { valid: true };
};

export const validateWish = (wish: string): { valid: boolean; message?: string } => {
  const trimmed = wish.trim();

  if (!trimmed) {
    return { valid: false, message: '写点什么吧' };
  }

  if (trimmed.length > 200) {
    return { valid: false, message: '最多200个字' };
  }

  return { valid: true };
};
