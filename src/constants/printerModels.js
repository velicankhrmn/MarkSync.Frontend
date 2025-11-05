/**
 * Printer Models Configuration
 * .env dosyasından yazıcı modellerini okur ve yönetir
 */

/**
 * .env'den yazıcı modellerini al ve array'e çevir
 * @returns {string[]} Yazıcı modelleri listesi
 */
export const getPrinterModels = () => {
  const modelsString = import.meta.env.VITE_PRINTER_MODELS || '';

  if (!modelsString) {
    // Varsayılan modeller (eğer .env'de tanımlanmamışsa)
    return [
      'Industrial Printer X1000',
      'Industrial Printer X1500',
      'Industrial Printer X2000',
      'Thermal Printer T500',
      'Label Printer L300',
      'Custom Printer Model'
    ];
  }

  // Virgülle ayrılmış string'i array'e çevir ve trim yap
  return modelsString
    .split(',')
    .map(model => model.trim())
    .filter(model => model.length > 0);
};

/**
 * Yazıcı modeli geçerli mi kontrol et
 * @param {string} model - Kontrol edilecek model
 * @returns {boolean} Model geçerli mi?
 */
export const isValidPrinterModel = (model) => {
  const models = getPrinterModels();
  return models.includes(model);
};

// Export as default
export default {
  getPrinterModels,
  isValidPrinterModel
};
