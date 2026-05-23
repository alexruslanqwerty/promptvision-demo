/* ==========================================================================
   PROMPTVISION AI - FRONTEND APPLICATION ORCHESTRATOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- DOM Elements ---
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const dropzonePreview = document.getElementById('dropzone-preview-container');
  const batchPreviewGrid = document.getElementById('batch-preview-grid');
  const clearAllPreviewsBtn = document.getElementById('clear-all-previews-btn');
  const imageMeta = document.getElementById('image-meta');
  const metaFilename = document.getElementById('meta-filename');
  const metaFilesize = document.getElementById('meta-filesize');
  
  const providerSelect = document.getElementById('provider-select');
  const modeSelect = document.getElementById('mode-select');
  const langSelect = document.getElementById('lang-select');
  const templateTagsContainer = document.getElementById('template-tags-container');
  const templateTagBtns = document.querySelectorAll('.template-tag-btn');
  const customIntentInput = document.getElementById('custom-intent-input');
  const generateBtn = document.getElementById('generate-btn');
  const btnIcon = document.getElementById('btn-icon');
  const btnText = document.getElementById('btn-text');
  
  const outputBox = document.getElementById('output-box');
  const outputPlaceholder = document.getElementById('output-placeholder-el');
  const outputLoader = document.getElementById('output-loader-el');
  const loadingStepText = document.getElementById('loading-step-text');
  const outputText = document.getElementById('output-text');
  const outputActions = document.getElementById('output-actions');
  
  const copyBtn = document.getElementById('copy-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const regenerateBtn = document.getElementById('regenerate-btn');
  const exportTxtBtn = document.getElementById('export-txt-btn');
  const resetBtn = document.getElementById('reset-btn');
  
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = themeToggleBtn.querySelector('.sun');
  const moonIcon = themeToggleBtn.querySelector('.moon');
  
  const activeEngineText = document.getElementById('active-engine-text');
  const engineBadgeDot = document.querySelector('#engine-badge .badge-dot');
  
  // Settings Modal Elements
  const settingsModal = document.getElementById('settings-modal');
  const sidebarSettingsBtn = document.getElementById('sidebar-settings-btn');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const geminiKeyInput = document.getElementById('gemini-key-input');
  const toggleKeyVisibilityBtn = document.getElementById('toggle-key-visibility-btn');
  const lmStudioUrlInput = document.getElementById('lm-studio-url-input');
  const lmStudioModelInput = document.getElementById('lm-studio-model-input');
  
  // History Drawer Elements
  const historyDrawer = document.getElementById('history-drawer');
  const historyBtn = document.getElementById('nav-history-btn');
  const closeHistoryBtn = document.getElementById('close-history-btn');
  const closeHistoryFooterBtn = document.getElementById('close-history-footer-btn');
  const historyItemsContainer = document.getElementById('history-items-container');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  // Gallery Modal Elements
  const galleryModal = document.getElementById('gallery-modal');
  const galleryBtn = document.getElementById('nav-gallery-btn');
  const closeGalleryBtn = document.getElementById('close-gallery-btn');
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryEmptyState = document.getElementById('gallery-empty-state');
  const saveGalleryBtn = document.getElementById('save-gallery-btn');

  // Editor Modal Elements
  const editorModal = document.getElementById('editor-modal');
  const closeEditorBtn = document.getElementById('close-editor-btn');
  const editorVideo = document.getElementById('editor-video');
  const editorCanvasWrapper = document.getElementById('editor-canvas-wrapper');
  const editorCanvas = document.getElementById('editor-canvas');
  const editorImageTools = document.getElementById('editor-image-tools');
  const editorVideoTools = document.getElementById('editor-video-tools');
  const editorColor = document.getElementById('editor-color');
  const editorBrushSize = document.getElementById('editor-brush-size');
  const editorClearBtn = document.getElementById('editor-clear-btn');
  const editorCaptureBtn = document.getElementById('editor-capture-btn');
  const editorSaveBtn = document.getElementById('editor-save-btn');
  
  // Refinement Panel Elements
  const refinementToggleBtn = document.getElementById('refinement-toggle-btn');
  const refinementPanel = document.getElementById('refinement-panel');
  const refinementArrow = document.getElementById('refinement-arrow');
  const paramChips = document.querySelectorAll('.param-chip');
  const styleCards = document.querySelectorAll('.style-card');
  const randomizeParamsBtn = document.getElementById('randomize-params-btn');
  
  // Editor State
  let ctx = editorCanvas.getContext('2d');
  let isDrawing = false;
  let currentFileMode = 'image'; // 'image' | 'video'
  
  const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
  const mainSidebar = document.getElementById('main-sidebar');

  // --- State Variables ---
  let selectedFiles = []; // Array of { file, base64, thumbnail, mode }
  let currentFileIndex = 0; // For batch processing
  let isGenerating = false;
  let typingInterval = null;
  let lastGeneratedTexts = [];


  // --- Initial Config Load ---
  const loadSettings = () => {
    geminiKeyInput.value = localStorage.getItem('gemini_api_key') || '';
    lmStudioUrlInput.value = localStorage.getItem('lm_studio_url') || 'http://localhost:1234/v1';
    lmStudioModelInput.value = localStorage.getItem('lm_studio_model') || '';
  };
  
  loadSettings();

  // --- Toast Notifications ---
  const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add brief icon
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    
    // Auto-destruct after 4.5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px) scale(0.95)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  // --- Theme Toggle Control ---
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);
  };

  const updateThemeUI = (theme) => {
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  };

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeUI(newTheme);
    showToast(`Переключено на ${newTheme === 'dark' ? 'Темную' : 'Светлую'} тему`, 'info');
  });

  initTheme();

  // --- API Provider Syncing ---
  const updateEngineUI = () => {
    const provider = providerSelect.value;
    if (provider === 'gemini') {
      activeEngineText.textContent = 'Gemini API';
      engineBadgeDot.className = 'badge-dot gemini';
    } else {
      activeEngineText.textContent = 'LM Studio';
      engineBadgeDot.className = 'badge-dot local';
    }
  };

  providerSelect.addEventListener('change', updateEngineUI);
  updateEngineUI();

  // --- Template Tags Handler ---
  const setActiveTemplate = (modeValue) => {
    if (!modeSelect) return;
    modeSelect.value = modeValue;
    templateTagBtns.forEach(btn => {
      if (btn.getAttribute('data-value') === modeValue) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  templateTagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');
      setActiveTemplate(val);
      showToast(`Выбран шаблон: ${btn.textContent}`, 'info');
    });
  });

  // --- Refinement Panel Logic ---
  let selectedRefinements = {
    lighting: [], camera: [], lens: [], comp: [], mood: [], style: []
  };

  if (refinementToggleBtn) {
    refinementToggleBtn.addEventListener('click', () => {
      const isHidden = refinementPanel.style.display === 'none';
      refinementPanel.style.display = isHidden ? 'block' : 'none';
      refinementArrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
      refinementToggleBtn.style.borderBottomLeftRadius = isHidden ? '0' : 'var(--radius-md)';
      refinementToggleBtn.style.borderBottomRightRadius = isHidden ? '0' : 'var(--radius-md)';
    });
  }

  const toggleParam = (category, val, el) => {
    const list = selectedRefinements[category];
    if (list.includes(val)) {
      list.splice(list.indexOf(val), 1);
      el.classList.remove('active');
    } else {
      list.push(val);
      el.classList.add('active');
    }
  };

  paramChips.forEach(chip => {
    chip.addEventListener('click', () => {
      toggleParam(chip.getAttribute('data-category'), chip.getAttribute('data-val'), chip);
    });
  });

  styleCards.forEach(card => {
    card.addEventListener('click', () => {
      toggleParam(card.getAttribute('data-category'), card.getAttribute('data-val'), card);
    });
  });

  if (randomizeParamsBtn) {
    randomizeParamsBtn.addEventListener('click', () => {
      // Clear current
      paramChips.forEach(c => c.classList.remove('active'));
      styleCards.forEach(c => c.classList.remove('active'));
      Object.keys(selectedRefinements).forEach(k => selectedRefinements[k] = []);
      
      // Randomly pick 1 from each category
      const categories = ['lighting', 'camera', 'lens', 'comp', 'mood'];
      categories.forEach(cat => {
        const chips = Array.from(document.querySelectorAll(`.param-chip[data-category="${cat}"]`));
        if (chips.length > 0) {
          const randChip = chips[Math.floor(Math.random() * chips.length)];
          toggleParam(cat, randChip.getAttribute('data-val'), randChip);
        }
      });
      // Pick 1 style
      if (styleCards.length > 0) {
        const randStyle = styleCards[Math.floor(Math.random() * styleCards.length)];
        toggleParam('style', randStyle.getAttribute('data-val'), randStyle);
      }
      showToast('Параметры выбраны случайно!', 'success');
    });
  }

  // --- File Downscaling for History Thumbnail (Memory optimization) ---
  const generateThumbnail = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 120; // 120px max dimension for thumbnail
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress thumbnail to low-quality JPEG
          resolve(canvas.toDataURL('image/jpeg', 0.65));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // --- Handle File Processing and Selection ---
  const handleFilesSelection = async (files) => {
    if (!files || files.length === 0) return;
    
    // If multiple files, we process them one by one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        showToast(`Недопустимый формат файла: ${file.name}`, 'error');
        continue;
      }
      
      const fileMode = file.type.startsWith('video/') ? 'video' : 'image';
      
      // If it's a video and we are uploading multiple files, we skip it to prevent UI blocking
      if (fileMode === 'video' && files.length > 1) {
         showToast(`Видео (${file.name}) не поддерживается в пакетном режиме, пропущено.`, 'error');
         continue;
      }

      if (fileMode === 'image') {
        const reader = new FileReader();
        const base64Promise = new Promise(resolve => {
          reader.onload = (e) => resolve(e.target.result);
        });
        reader.readAsDataURL(file);
        
        const base64 = await base64Promise;
        const thumbnail = await generateThumbnail(file);
        
        selectedFiles.push({
           file: file,
           base64: base64,
           thumbnail: thumbnail,
           mode: fileMode,
           id: Date.now() + Math.random().toString(36).substring(7)
        });
      } else {
        // Single video logic (same as before)
        const videoUrl = URL.createObjectURL(file);
        editorVideo.src = videoUrl;
        editorVideo.style.display = 'block';
        editorCanvasWrapper.style.display = 'none';
        editorImageTools.style.display = 'none';
        editorVideoTools.style.display = 'flex';
        editorCaptureBtn.style.display = 'flex';
        editorSaveBtn.style.display = 'none';
        
        editorModal.style.display = 'flex';
        
        // Push a placeholder for the video, it will be updated when the user captures a frame
        selectedFiles.push({
           file: file,
           base64: null,
           thumbnail: null,
           mode: 'video',
           id: Date.now() + Math.random().toString(36).substring(7)
        });
        showToast('Загружено видео. Поставьте на паузу и захватите кадр.', 'info');
      }
    }
    
    updateBatchUI();
  };

  const removeFileFromBatch = (id) => {
    selectedFiles = selectedFiles.filter(f => f.id !== id);
    updateBatchUI();
  };

  const updateBatchUI = () => {
    if (selectedFiles.length === 0) {
       resetFileSelection();
       return;
    }
    
    dropzonePreview.style.display = 'block';
    imageMeta.style.display = 'flex';
    
    // Update Meta
    metaFilename.textContent = selectedFiles.length.toString();
    const totalSize = selectedFiles.reduce((acc, curr) => acc + curr.file.size, 0);
    metaFilesize.textContent = `${(totalSize / 1024).toFixed(1)} KB`;
    
    // Render Grid
    batchPreviewGrid.innerHTML = '';
    selectedFiles.forEach(f => {
       const thumbContainer = document.createElement('div');
       thumbContainer.className = 'batch-thumb-container';
       
       const img = document.createElement('img');
       img.src = f.thumbnail || f.base64 || '#'; // fallback
       
       const removeBtn = document.createElement('button');
       removeBtn.className = 'batch-thumb-remove';
       removeBtn.innerHTML = '✕';
       removeBtn.onclick = (e) => {
         e.stopPropagation();
         removeFileFromBatch(f.id);
       };
       
       const editBtn = document.createElement('button');
       editBtn.className = 'batch-thumb-edit';
       editBtn.innerHTML = 'Edit';
       editBtn.onclick = (e) => {
         e.stopPropagation();
         openEditorForBatchItem(f.id);
       };
       
       thumbContainer.appendChild(img);
       thumbContainer.appendChild(removeBtn);
       // Only show edit for images
       if (f.base64 && f.mode === 'image') thumbContainer.appendChild(editBtn);
       
       batchPreviewGrid.appendChild(thumbContainer);
    });
    
    generateBtn.disabled = false;
    btnText.textContent = selectedFiles.length > 1 ? `Анализировать (${selectedFiles.length})` : 'Анализировать изображение';
    btnIcon.style.display = 'none';
  };

  // --- Editor & Video Grabber Logic ---
  let currentBatchEditId = null;

  const openEditorForBatchItem = (id) => {
    const fileObj = selectedFiles.find(f => f.id === id);
    if (!fileObj || !fileObj.base64) return;
    
    currentBatchEditId = id;
    const img = new Image();
    img.onload = () => {
      editorCanvas.width = img.width;
      editorCanvas.height = img.height;
      ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
      ctx.drawImage(img, 0, 0);
      
      editorVideo.style.display = 'none';
      editorCanvasWrapper.style.display = 'block';
      editorImageTools.style.display = 'flex';
      editorVideoTools.style.display = 'none';
      editorCaptureBtn.style.display = 'none';
      editorSaveBtn.style.display = 'flex';
      
      editorModal.style.display = 'flex';
    };
    img.src = fileObj.base64;
  };

  closeEditorBtn.addEventListener('click', () => {
    editorModal.style.display = 'none';
    if (currentFileMode === 'video') editorVideo.pause();
    currentBatchEditId = null;
  });

  // Canvas Drawing Logic
  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  };

  editorCanvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getMousePos(editorCanvas, e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });

  editorCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(editorCanvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = editorColor.value;
    ctx.lineWidth = editorBrushSize.value;
    ctx.lineCap = 'round';
    ctx.stroke();
  });

  editorCanvas.addEventListener('mouseup', () => {
    isDrawing = false;
  });
  
  editorCanvas.addEventListener('mouseleave', () => {
    isDrawing = false;
  });

  editorClearBtn.addEventListener('click', () => {
    if (currentBatchEditId) {
      openEditorForBatchItem(currentBatchEditId); // Re-draw original image
    } else {
      // Re-capture from video
      editorCaptureBtn.click();
    }
  });

  // Video Grabber Logic
  editorCaptureBtn.addEventListener('click', () => {
    editorVideo.pause();
    editorCanvas.width = editorVideo.videoWidth;
    editorCanvas.height = editorVideo.videoHeight;
    ctx.drawImage(editorVideo, 0, 0, editorCanvas.width, editorCanvas.height);
    
    // Switch to image editing mode
    editorVideo.style.display = 'none';
    editorCanvasWrapper.style.display = 'block';
    editorImageTools.style.display = 'flex';
    editorVideoTools.style.display = 'none';
    editorCaptureBtn.style.display = 'none';
    editorSaveBtn.style.display = 'flex';
    
    // For single video, id is usually selectedFiles[0].id
    if (selectedFiles.length > 0 && selectedFiles[0].mode === 'video') {
       currentBatchEditId = selectedFiles[0].id;
    }
  });

  editorSaveBtn.addEventListener('click', async () => {
    if (!currentBatchEditId && selectedFiles.length > 0) {
       currentBatchEditId = selectedFiles[0].id;
    }
    
    if (currentBatchEditId) {
      const fileObjIndex = selectedFiles.findIndex(f => f.id === currentBatchEditId);
      if (fileObjIndex > -1) {
        // Save canvas to imageBase64
        const newBase64 = editorCanvas.toDataURL('image/jpeg', 0.9);
        selectedFiles[fileObjIndex].base64 = newBase64;
        
        // Re-generate thumbnail
        const blob = await fetch(newBase64).then(res => res.blob());
        const newThumb = await generateThumbnail(blob);
        selectedFiles[fileObjIndex].thumbnail = newThumb;
        
        // If it was a video, turn it into an image in the batch now
        if (selectedFiles[fileObjIndex].mode === 'video') {
           selectedFiles[fileObjIndex].mode = 'image';
           selectedFiles[fileObjIndex].file = new File([blob], 'Video-Frame.jpg', { type: 'image/jpeg' });
        }
        
        updateBatchUI();
      }
    }
    
    editorModal.style.display = 'none';
    currentBatchEditId = null;
    showToast('Изображение обновлено!', 'success');
  });

  // --- File Drag & Drop Listeners ---
  dropzone.addEventListener('click', () => fileInput.click());
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFilesSelection(e.target.files);
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFilesSelection(e.dataTransfer.files);
    }
  });

  // Clipboard Paste Event
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    const files = [];
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        const renamedFile = new File([file], `Pasted-Image-${Date.now()}.png`, { type: file.type });
        files.push(renamedFile);
      }
    }
    if (files.length > 0) {
      handleFilesSelection(files);
      showToast(files.length > 1 ? 'Изображения вставлены из буфера обмена!' : 'Изображение вставлено из буфера обмена!', 'success');
    }
  });

  // Remove Selected File Action
  const resetFileSelection = () => {
    selectedFiles = [];
    currentFileIndex = 0;
    fileInput.value = '';
    dropzonePreview.style.display = 'none';
    imageMeta.style.display = 'none';
    generateBtn.disabled = true;
    btnText.textContent = 'Выберите изображение';
    btnIcon.style.display = 'none';
    batchPreviewGrid.innerHTML = '';
  };

  clearAllPreviewsBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid triggering file input browse dialog
    resetFileSelection();
    showToast('Все изображения удалены', 'info');
  });

  // --- Typewriter Effect Printing ---
  const typeText = (element, text, callback, appendMode = false) => {
    if (!appendMode) element.innerHTML = '';
    element.style.display = 'block';
    
    // Check if text is an array (A/B Test output)
    if (Array.isArray(text)) {
      element.style.display = 'none'; // hide single output
      document.getElementById('output-ab-area').style.display = 'flex';
      
      const elGemini = document.getElementById('output-text-gemini');
      const elLmStudio = document.getElementById('output-text-lmstudio');
      
      if (!appendMode) {
        elGemini.innerHTML = '';
        elLmStudio.innerHTML = '';
      }
      
      // We can just type both concurrently but to save logic we'll just plop them in
      elGemini.innerText += text[0] + '\n\n---\n';
      elLmStudio.innerText += text[1] + '\n\n---\n';
      
      if (callback) callback();
      return;
    }
    
    // Standard single output typewriter
    document.getElementById('output-ab-area').style.display = 'none';
    
    // Very simple formatting of paragraphs and bold markdown tags
    const paragraphs = text.split('\n\n');
    let currentParagraphIndex = 0;
    
    const printParagraph = () => {
      if (currentParagraphIndex >= paragraphs.length) {
        if (callback) callback();
        return;
      }
      
      const p = document.createElement('p');
      element.appendChild(p);
      
      // Parse markdown bold **text** into raw HTML temporarily
      let text = paragraphs[currentParagraphIndex];
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/---\s*\n/g, '<hr>'); // Horizontal rule line splits
      
      // Print paragraph text instantly (or character-by-character if short)
      p.innerHTML = text;
      
      currentParagraphIndex++;
      // Autoscroll output card as new text yields
      outputBox.scrollTop = outputBox.scrollHeight;
      
      setTimeout(printParagraph, 100);
    };
    
    printParagraph();
  };

  // --- Main Generate Handler ---
  // --- Main Generate Handler ---
  const analyzeImage = async () => {
    if (isGenerating || selectedFiles.length === 0) return;
    
    isGenerating = true;
    generateBtn.disabled = true;
    btnIcon.style.display = 'inline-block';
    
    // Transition UI to Active Scanning Loader
    outputPlaceholder.style.display = 'none';
    outputText.style.display = 'none';
    outputActions.style.display = 'none';
    outputLoader.style.display = 'flex';
    
    // Dynamically change loading status prompts to simulate active scanning
    const stepPrompts = [
      'Инициализация подключения...',
      'Загрузка изображения на локальный сервер...',
      'Нейросеть анализирует цвета и освещение...',
      'Распознавание объектов и композиции...',
      'Формулирование описания на русском языке...',
      'Финальная обработка текста...'
    ];
    
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < stepPrompts.length - 1) {
        currentStep++;
        loadingStepText.textContent = stepPrompts[currentStep];
      }
    }, 4500);

    const provider = providerSelect.value;
    const compareCheckbox = document.getElementById('compare-engine-checkbox');
    const isComparing = compareCheckbox && compareCheckbox.checked;
    const mode = modeSelect.value;
    const lang = langSelect.value;
    const customIntent = customIntentInput ? customIntentInput.value : '';
    
    // Compile overrides if entered
    const geminiKey = localStorage.getItem('gemini_api_key') || '';
    const lmStudioUrl = localStorage.getItem('lm_studio_url') || '';
    const lmStudioModel = localStorage.getItem('lm_studio_model') || '';

    // We will collect results here
    let fullOutput = '';
    
    // Clear output text completely at the start of batch
    outputText.innerHTML = '';
    lastGeneratedTexts = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const currentFileObj = selectedFiles[i];
      btnText.textContent = `Обработка ${i + 1} из ${selectedFiles.length}...`;
      
      try {
        let fileToUpload = currentFileObj.file;
        if (currentFileObj.base64 && currentFileObj.base64.startsWith('data:image')) {
           const res = await fetch(currentFileObj.base64);
           fileToUpload = await res.blob();
        }

        const createFormData = (targetProvider) => {
          const formData = new FormData();
          formData.append('image', fileToUpload, currentFileObj.file.name || 'image.jpg');
          formData.append('provider', targetProvider);
          formData.append('mode', mode);
          formData.append('language', lang);
          formData.append('customIntent', customIntent);
          formData.append('refinements', JSON.stringify(selectedRefinements));
          formData.append('geminiKeyOverride', geminiKey);
          formData.append('lmStudioUrlOverride', lmStudioUrl);
          formData.append('lmStudioModelOverride', lmStudioModel);
          return formData;
        };

        let rawTextResult = '';

        // --- DEMO SIMULATOR LOGIC ---
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate network latency

        const fakePrompts = [
          "**Общее описание:** На изображении представлена потрясающая цифровая иллюстрация в стиле киберпанк. На переднем плане изображен футуристический автомобиль с неоновой подсветкой. \n\n**Освещение:** Яркий контрастный свет, преобладают фиолетовые и синие неоновые тона.\n\n**Промпт:** Cyberpunk city street at night, futuristic sports car with glowing neon tires, rain reflecting neon signs, highly detailed, photorealistic, 8k, Unreal Engine 5 render, cinematic lighting --ar 16:9 --v 6.0",
          "**Общее описание:** Это великолепный пейзаж. Мы видим густой лес на рассвете, лучи утреннего солнца пробиваются сквозь ветви деревьев.\n\n**Освещение:** Мягкий, теплый золотистый утренний свет, создающий атмосферу спокойствия.\n\n**Промпт:** Serene forest at sunrise, rays of golden light piercing through dense foliage, masterpiece, highly detailed, tranquil atmosphere, masterpiece --ar 3:2 --v 6.0",
          "**Общее описание:** Профессиональная портретная фотография молодой девушки. Она смотрит прямо в камеру, на заднем фоне размытые огни ночного города (эффект боке).\n\n**Освещение:** Студийное портретное освещение, легкий контровой свет, подчеркивающий волосы.\n\n**Промпт:** Portrait photography of a young beautiful woman looking directly at camera, bokeh background of night city lights, 85mm lens, f/1.4, cinematic lighting, highly detailed, 8k resolution, photorealistic --ar 4:5 --v 6.0"
        ];
        
        rawTextResult = fakePrompts[Math.floor(Math.random() * fakePrompts.length)];
        // -----------------------------

        // Wait for typing animation to complete for this item
        await new Promise((resolve) => {
          // If batch processing multiple files, prepend a header
          let textToType = rawTextResult;
          if (selectedFiles.length > 1 && !isComparing) {
             textToType = `**Файл: ${currentFileObj.file.name}**\n\n${rawTextResult}\n\n---\n`;
          }
          
          outputLoader.style.display = 'none';
          
          typeText(outputText, textToType, () => {
             resolve();
          }, true); // appendMode = true
        });
        
        const finalGeneratedText = isComparing ? `[Gemini]:\n${rawTextResult[0]}\n\n[LM Studio]:\n${rawTextResult[1]}` : rawTextResult;
        lastGeneratedTexts.push(finalGeneratedText);
        saveToHistory(currentFileObj.thumbnail || currentFileObj.base64, finalGeneratedText, mode, lang, isComparing ? 'compare' : provider, customIntent);

      } catch (error) {
        console.error(error);
        const errText = `**Файл: ${currentFileObj.file.name}**\n\nОшибка: ${error.message}\n\n---\n`;
        outputLoader.style.display = 'none';
        
        await new Promise((resolve) => {
          typeText(outputText, errText, resolve, true);
        });
      }
    } // End of For loop

    clearInterval(stepInterval);
    isGenerating = false;
    generateBtn.disabled = false;
    btnIcon.style.display = 'none';
    btnText.textContent = selectedFiles.length > 1 ? `Анализировать (${selectedFiles.length})` : 'Анализировать изображение';
    outputActions.style.display = 'flex';
    showToast('Пакетная обработка завершена!', 'success');
  };

  generateBtn.addEventListener('click', analyzeImage);
  regenerateBtn.addEventListener('click', analyzeImage);

  // --- Output Actions ---
  
  // Copy to Clipboard Action
  copyBtn.addEventListener('click', () => {
    const rawText = outputText.innerText;
    navigator.clipboard.writeText(rawText)
      .then(() => {
        copyBtnText.textContent = 'Скопировано!';
        copyBtn.style.borderColor = 'var(--success)';
        copyBtn.style.color = 'var(--success)';
        showToast('Текст скопирован в буфер обмена!', 'success');
        
        setTimeout(() => {
          copyBtnText.textContent = 'Копировать';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2000);
      })
      .catch((err) => {
        console.error('Copy failure', err);
        showToast('Не удалось скопировать текст', 'error');
      });
  });

  // Export TXT Action
  exportTxtBtn.addEventListener('click', () => {
    const rawText = outputText.innerText;
    if (!rawText) return;
    const blob = new Blob([rawText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PromptVision_Export_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Файл успешно сохранен!', 'success');
  });

  // Full Panel Reset Action
  const performFullReset = () => {
    resetFileSelection();
    if (customIntentInput) customIntentInput.value = '';
    setActiveTemplate('detailed');
    outputPlaceholder.style.display = 'flex';
    outputText.style.display = 'none';
    outputActions.style.display = 'none';
    outputLoader.style.display = 'none';
    showToast('Панели сброшены', 'info');
  };

  resetBtn.addEventListener('click', performFullReset);


  // --- Settings Modal Overlays ---
  
  const toggleModal = (modal, show) => {
    modal.style.display = show ? 'flex' : 'none';
  };

  sidebarSettingsBtn.addEventListener('click', () => {
    loadSettings();
    toggleModal(settingsModal, true);
  });
  
  closeSettingsBtn.addEventListener('click', () => toggleModal(settingsModal, false));
  cancelSettingsBtn.addEventListener('click', () => toggleModal(settingsModal, false));

  // Toggle API key visibility inside Settings
  toggleKeyVisibilityBtn.addEventListener('click', () => {
    const type = geminiKeyInput.type === 'password' ? 'text' : 'password';
    geminiKeyInput.type = type;
    toggleKeyVisibilityBtn.textContent = type === 'password' ? '👁️' : '🔒';
  });

  // Save Settings Clicked
  saveSettingsBtn.addEventListener('click', () => {
    localStorage.setItem('gemini_api_key', geminiKeyInput.value.trim());
    localStorage.setItem('lm_studio_url', lmStudioUrlInput.value.trim());
    localStorage.setItem('lm_studio_model', lmStudioModelInput.value.trim());
    
    toggleModal(settingsModal, false);
    showToast('Настройки API успешно сохранены!', 'success');
    updateEngineUI();
  });


  // --- Gallery Operations ---
  let savedGalleryItems = [];

  const renderGallery = async () => {
    galleryGrid.innerHTML = '';
    
    // DEMO: Fetch from localStorage instead of server
    const saved = localStorage.getItem('demo_gallery');
    savedGalleryItems = saved ? JSON.parse(saved) : [];

    if (savedGalleryItems.length === 0) {
      galleryEmptyState.style.display = 'flex';
      return;
    }
    
    galleryEmptyState.style.display = 'none';
    
    savedGalleryItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `
        <img src="${item.image}" alt="Saved prompt">
        <div class="gallery-card-content">
          <div class="gallery-card-prompt">${item.text}</div>
          <div class="gallery-card-meta">
            <span class="gallery-card-badge">${item.provider}</span>
            <span>${item.date}</span>
          </div>
        </div>
        <div class="gallery-card-overlay">
          <button class="gallery-card-btn copy-btn" data-text="${encodeURIComponent(item.text)}" title="Копировать">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button class="gallery-card-btn delete-btn" data-id="${item.id}" title="Удалить">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;

      // Copy Action
      card.querySelector('.copy-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const text = decodeURIComponent(e.currentTarget.getAttribute('data-text'));
        navigator.clipboard.writeText(text).then(() => {
          showToast('Промпт скопирован из галереи!', 'success');
        });
      });

      // Delete Action
      card.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        
        // DEMO: Delete from localStorage
        let saved = localStorage.getItem('demo_gallery');
        let items = saved ? JSON.parse(saved) : [];
        items = items.filter(i => i.id !== item.id);
        localStorage.setItem('demo_gallery', JSON.stringify(items));
        
        renderGallery();
        showToast('Файл удален из локальной галереи', 'info');
      });

      // Click card to restore in main view
      card.addEventListener('click', async () => {
        // Fetch the image as base64 to restore into the editor correctly
        try {
          const res = await fetch(item.image);
          const blob = await res.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            selectedFiles = [{
               file: { name: 'Gallery-Image.jpg', size: blob.size, type: blob.type },
               base64: reader.result,
               thumbnail: reader.result,
               mode: 'image',
               id: Date.now()
            }];
            updateBatchUI();
          };
          reader.readAsDataURL(blob);
        } catch(e) {
          console.error("Could not load image data for editor", e);
        }
        
        providerSelect.value = item.provider;
        setActiveTemplate(item.mode);
        if (item.language) langSelect.value = item.language;
        updateEngineUI();
        
        outputPlaceholder.style.display = 'none';
        outputLoader.style.display = 'none';
        outputText.style.display = 'block';
        outputText.innerHTML = '';
        const paragraphs = item.text.split('\n\n');
        paragraphs.forEach(para => {
          const p = document.createElement('p');
          p.innerHTML = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/---\s*\n/g, '<hr>');
          outputText.appendChild(p);
        });
        outputActions.style.display = 'flex';
        toggleModal(galleryModal, false);
        showToast('Открыто из галереи', 'info');
      });

      galleryGrid.appendChild(card);
    });
  };

  // Gallery Modal Triggers
  galleryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderGallery();
    toggleModal(galleryModal, true);
    if (window.innerWidth <= 768) mainSidebar.classList.remove('open');
  });
  
  closeGalleryBtn.addEventListener('click', () => toggleModal(galleryModal, false));
  
  saveGalleryBtn.addEventListener('click', async () => {
    if (!outputText.innerText.trim() || selectedFiles.length === 0) return;
    
    saveGalleryBtn.disabled = true;
    saveGalleryBtn.style.opacity = '0.5';
    
    // Extract raw text fallback (if manual edit or array mismatch)
    let rawText = '';
    const paragraphs = outputText.querySelectorAll('p');
    paragraphs.forEach((p, idx) => {
      rawText += p.innerText + (idx < paragraphs.length - 1 ? '\n\n' : '');
    });

    const mode = document.querySelector('.template-tag-btn.active').dataset.mode;
    const provider = providerSelect.options[providerSelect.selectedIndex].text;
    const lang = langSelect.value;
    
    let successCount = 0;
    
    try {
      // Loop over all selected files to save them individually
      for (let i = 0; i < selectedFiles.length; i++) {
        // Use the exact text generated for this specific image if available, else fallback to rawText
        const textToSave = (lastGeneratedTexts.length === selectedFiles.length) ? lastGeneratedTexts[i] : rawText;
        
        const payload = {
          imageBase64: selectedFiles[i].base64,
          text: textToSave,
          mode: mode,
          provider: provider,
          language: lang
        };
        
        // DEMO: Save to localStorage instead of server
        let saved = localStorage.getItem('demo_gallery');
        let items = saved ? JSON.parse(saved) : [];
        items.unshift({
           id: Date.now() + i,
           image: payload.imageBase64,
           text: payload.text,
           mode: payload.mode,
           provider: payload.provider,
           language: payload.language,
           date: new Date().toLocaleString('ru-RU')
        });
        localStorage.setItem('demo_gallery', JSON.stringify(items));
        successCount++;
      }
      
      if (successCount > 0) {
        showToast(`Сохранено в демо-галерею (локально): ${successCount} 📁`, 'success');
      } else {
        showToast('Ошибка сохранения', 'error');
      }
    } catch (error) {
      showToast('Ошибка', 'error');
    }
    
    saveGalleryBtn.disabled = false;
    saveGalleryBtn.style.opacity = '1';
  });

  // --- Scan History Operations ---

  const getHistory = () => {
    const h = localStorage.getItem('ai_describer_history');
    return h ? JSON.parse(h) : [];
  };

  const renderHistory = () => {
    const history = getHistory();
    historyItemsContainer.innerHTML = '';
    
    if (history.length === 0) {
      historyItemsContainer.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-state-icon">📂</div>
          <h4>История пуста</h4>
          <p>Все сделанные вами анализы будут сохраняться в браузере локально.</p>
        </div>
      `;
      return;
    }

    const modeLabels = {
      'detailed': 'Подробное описание',
      'caption': 'Краткое описание',
      'people': 'Описание людей',
      'marketing': 'Маркетинговый текст',
      'fashion': 'Одежда и мода',
      'objects': 'Распознавание объектов',
      'problems': 'Решение задач',
      'art-style': 'Анализ худ. стиля',
      'chatgpt-prompt': 'Промпт ChatGPT',
      'image-prompt': 'Промпт изображения',
      'nano-banana': 'Промпт Nano Banana',
      'midjourney-prompt': 'Промпт Midjourney',
      'flux-prompt': 'Промпт Flux',
      'pixar-3d': 'Промпт 3D Pixar',
      'json-prompt': 'JSON-промпт'
    };

    history.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-item';
      card.innerHTML = `
        <img src="${item.image}" alt="Scan thumb" class="history-thumb">
        <div class="history-content">
          <div class="history-date">${item.date}</div>
          <div class="history-text-preview">${item.text}</div>
          <span class="history-tag">${modeLabels[item.mode] || 'Анализ'} (${item.provider})</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="history-star-btn" data-id="${item.id}" aria-label="В галерею" title="Сохранить в галерею" style="background:transparent; border:none; cursor:pointer; font-size:16px;">⭐</button>
          <button class="history-delete-item-btn" data-id="${item.id}" aria-label="Удалить из истории">✕</button>
        </div>
      `;

      // Star Action
      card.querySelector('.history-star-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        
        const payload = {
          imageBase64: item.image,
          text: item.text,
          mode: item.mode,
          provider: item.provider,
          language: item.language
        };
        
        try {
          // DEMO: Save to localStorage
          let saved = localStorage.getItem('demo_gallery');
          let items = saved ? JSON.parse(saved) : [];
          items.unshift({
             id: Date.now(),
             image: payload.imageBase64,
             text: payload.text,
             mode: payload.mode,
             provider: payload.provider,
             language: payload.language,
             date: new Date().toLocaleString('ru-RU')
          });
          localStorage.setItem('demo_gallery', JSON.stringify(items));
          
          showToast('Сохранено в демо-галерею! 📁', 'success');
          if (galleryModal.style.display !== 'none') {
            renderGallery();
          }
        } catch (error) {
          showToast('Ошибка сохранения', 'error');
        }
      });

      // Click to load history item directly back into active view
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('history-delete-item-btn')) return; // handled separately
        
        // Restore values
        selectedFiles = [{
           file: { name: 'History-Image.jpg', size: 0, type: 'image/jpeg' },
           base64: item.image,
           thumbnail: item.image,
           mode: 'image',
           id: Date.now()
        }];
        updateBatchUI();
        
        // Select matching dropdown options
        providerSelect.value = item.provider;
        setActiveTemplate(item.mode);
        langSelect.value = item.language;
        if (customIntentInput) customIntentInput.value = item.customIntent || '';
        updateEngineUI();
        
        // Render text
        outputPlaceholder.style.display = 'none';
        outputLoader.style.display = 'none';
        outputText.style.display = 'block';
        outputText.innerHTML = '';
        
        // Render the restored text (instantly without typewriter delay)
        const paragraphs = item.text.split('\n\n');
        paragraphs.forEach(para => {
          const p = document.createElement('p');
          p.innerHTML = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/---\s*\n/g, '<hr>');
          outputText.appendChild(p);
        });
        
        outputActions.style.display = 'flex';
        toggleModal(historyDrawer, false);
        showToast('Анализ восстановлен из истории!', 'info');
      });

      historyItemsContainer.appendChild(card);
    });

    // Delete single history item listener
    const deleteButtons = historyItemsContainer.querySelectorAll('.history-delete-item-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering restoration click
        const idToDelete = parseInt(btn.getAttribute('data-id'));
        let hist = getHistory();
        hist = hist.filter(item => item.id !== idToDelete);
        localStorage.setItem('ai_describer_history', JSON.stringify(hist));
        renderHistory();
        showToast('Запись удалена', 'info');
      });
    });
  };

  const saveToHistory = (imageUri, description, mode, language, provider, customIntent) => {
    const newItem = {
      id: Date.now(),
      date: new Date().toLocaleString('ru-RU'),
      image: imageUri,
      text: description,
      mode: mode,
      language: language,
      provider: provider,
      customIntent: customIntent || ''
    };
    
    let hist = getHistory();
    hist.unshift(newItem);
    if (hist.length > 20) hist.pop(); // keep history length bounded to 20 scans
    localStorage.setItem('ai_describer_history', JSON.stringify(hist));
    renderHistory();
  };

  // History Drawer Controls
  historyBtn.addEventListener('click', () => {
    renderHistory();
    toggleModal(historyDrawer, true);
  });
  
  closeHistoryBtn.addEventListener('click', () => toggleModal(historyDrawer, false));
  closeHistoryFooterBtn.addEventListener('click', () => toggleModal(historyDrawer, false));

  // Clear all history clicked
  clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите полностью очистить историю сканирований?')) {
      localStorage.removeItem('ai_describer_history');
      renderHistory();
      showToast('История сканирований полностью очищена', 'info');
    }
  });


  // --- Mobile Sidebar Controls ---
  mobileSidebarToggle.addEventListener('click', () => {
    mainSidebar.classList.toggle('open');
  });

  // Close sidebar on clicking navigate button (if on mobile)
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainSidebar.classList.remove('open');
    });
  });

});
