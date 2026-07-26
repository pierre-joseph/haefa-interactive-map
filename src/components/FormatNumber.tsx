
export const formatNumber = (value: number, language: string): string => {
  if (language === "bn") {
    return new Intl.NumberFormat("bn-BD-u-nu-beng").format(value);
  }
  return new Intl.NumberFormat("en").format(value);
};