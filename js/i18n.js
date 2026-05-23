const translations = {
  ru: {
    app_title: "Анализатор Изображений & Генератор Промптов",
    nav_describer: "Анализ изображений",
    nav_history: "История сканирований",
    api_settings: "Настройки API",
    status_connected: "Связь установлена",
    step1_title: "1. Загрузка Изображения",
    step1_subtitle: "Вставьте файл из буфера обмена, перетащите его или выберите на ПК",
    dropzone_title: "Перетащите изображение сюда",
    dropzone_text_or: "или",
    dropzone_text_browse: "выберите файл",
    dropzone_shortcut: "Ctrl + V для вставки",
    file_info: "Информация о файле",
    meta_name: "Имя:",
    meta_size: "Размер:",
    meta_res: "Разрешение:",
    step2_title: "2. Настройки анализа",
    engine_label: "Интеллект (AI Движок):",
    engine_gemini: "Google Gemini API (Облачный/Быстрый)",
    engine_lmstudio: "LM Studio (Локальный/Оффлайн)",
    lang_label: "Язык вывода:",
    template_label: "Предоставленные шаблоны (необязательно):",
    intent_label: "Введите ваше намерение описать изображение:",
    intent_placeholder: "Создайте универсальный промпт для генерации изображения, вдохновлённый этим изображением, чтобы...",
    btn_analyze: "Выберите изображение",
    btn_analyze_active: "Анализировать изображение",
    btn_generating: "Генерация...",
    step3_title: "3. Описание & Анализ AI",
    step3_subtitle: "Результат автоматического распознавания сцены",
    placeholder_title: "Ожидание запуска",
    placeholder_text: "Загрузите картинку слева и нажмите кнопку «Анализировать», чтобы получить мгновенное описание.",
    loading_text: "Нейросеть изучает детали изображения...",
    btn_copy: "Копировать",
    btn_regenerate: "Повторить",
    btn_export_txt: "Скачать TXT",
    btn_reset: "Сброс",
    modal_settings_title: "Настройки API Провайдеров",
    gemini_key_label: "Ключ Google Gemini API",
    gemini_key_placeholder: "Вставьте ваш ключ API, начинающийся с AIza...",
    lmstudio_url_label: "URL сервера LM Studio",
    lmstudio_model_label: "ID Модели LM Studio (необязательно)",
    lmstudio_model_placeholder: "оставьте пустым для авто-определения",
    btn_cancel: "Отмена",
    btn_save: "Сохранить настройки",
    history_title: "Архив Сканирований",
    btn_clear_history: "Очистить всё",
    history_empty_title: "История пуста",
    history_empty_text: "Все сделанные вами анализы будут сохраняться в браузере локально.",
    toast_copy_success: "Текст скопирован в буфер обмена!",
    toast_copy_fail: "Не удалось скопировать текст",
    toast_export_success: "Файл успешно сохранен!",
    toast_settings_saved: "Настройки API успешно сохранены!",
    toast_history_cleared: "История очищена",
    toast_item_deleted: "Запись удалена",
    toast_restored: "Анализ восстановлен из истории!"
  },
  en: {
    app_title: "Image Analyzer & Prompt Generator",
    nav_describer: "Image Analysis",
    nav_history: "Scan History",
    api_settings: "API Settings",
    status_connected: "Connection Established",
    step1_title: "1. Upload Image",
    step1_subtitle: "Paste from clipboard, drag & drop, or select from PC",
    dropzone_title: "Drag & drop image here",
    dropzone_text_or: "or",
    dropzone_text_browse: "browse files",
    dropzone_shortcut: "Ctrl + V to paste",
    file_info: "File Information",
    meta_name: "Name:",
    meta_size: "Size:",
    meta_res: "Resolution:",
    step2_title: "2. Analysis Settings",
    engine_label: "AI Engine:",
    engine_gemini: "Google Gemini API (Cloud/Fast)",
    engine_lmstudio: "LM Studio (Local/Offline)",
    lang_label: "Output Language:",
    template_label: "Provided Templates (Optional):",
    intent_label: "Enter your custom intent for the description:",
    intent_placeholder: "Create a universal prompt for image generation inspired by this image, to...",
    btn_analyze: "Select Image First",
    btn_analyze_active: "Analyze Image",
    btn_generating: "Generating...",
    step3_title: "3. AI Description & Analysis",
    step3_subtitle: "Automatic scene recognition result",
    placeholder_title: "Awaiting Input",
    placeholder_text: "Upload an image on the left and click 'Analyze' to get an instant description.",
    loading_text: "AI is studying image details...",
    btn_copy: "Copy",
    btn_regenerate: "Regenerate",
    btn_export_txt: "Download TXT",
    btn_reset: "Reset",
    modal_settings_title: "API Provider Settings",
    gemini_key_label: "Google Gemini API Key",
    gemini_key_placeholder: "Paste your API key starting with AIza...",
    lmstudio_url_label: "LM Studio Server URL",
    lmstudio_model_label: "LM Studio Model ID (Optional)",
    lmstudio_model_placeholder: "leave blank to auto-detect",
    btn_cancel: "Cancel",
    btn_save: "Save Settings",
    history_title: "Scan Archive",
    btn_clear_history: "Clear All",
    history_empty_title: "History is empty",
    history_empty_text: "All your analyses will be saved locally in the browser.",
    toast_copy_success: "Text copied to clipboard!",
    toast_copy_fail: "Failed to copy text",
    toast_export_success: "File saved successfully!",
    toast_settings_saved: "API Settings saved successfully!",
    toast_history_cleared: "History cleared",
    toast_item_deleted: "Item deleted",
    toast_restored: "Analysis restored from history!"
  }
};

let currentUiLang = localStorage.getItem('ui_lang') || 'ru';

function applyTranslations(lang) {
  const dict = translations[lang] || translations['ru'];
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        // Special case for elements with icons inside
        const icon = el.querySelector('svg');
        if (icon) {
          el.innerHTML = '';
          el.appendChild(icon);
          const span = document.createElement('span');
          span.textContent = dict[key];
          span.setAttribute('data-i18n', key); // Wait, don't nest.
          // Better: just replace text nodes
          // Let's assume if it has data-i18n, we only update its text content directly if no icon,
          // or if it has an icon, it usually has a span inside it.
        }
        
        // Let's do it safely: if element has a span child without classes, or an id, update it.
        // The robust way is to put data-i18n DIRECTLY on the <span> elements.
        el.textContent = dict[key];
      }
    }
  });
}

function initI18n() {
  const select = document.getElementById('ui-lang-select');
  if (select) {
    select.value = currentUiLang;
    select.addEventListener('change', (e) => {
      currentUiLang = e.target.value;
      localStorage.setItem('ui_lang', currentUiLang);
      applyTranslations(currentUiLang);
    });
  }
  applyTranslations(currentUiLang);
}

// Ensure init is called after DOM load. It'll be called in app.js or here.
window.addEventListener('DOMContentLoaded', initI18n);
window.t = function(key) {
  return translations[currentUiLang][key] || translations['ru'][key] || key;
};
