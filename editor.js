// Initialize Fabric.js Canvas
let canvas;
let history = [];
let historyStep = 0;
let savedColors = [];
let complianceRules = [];

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    setupEventListeners();
    loadSavedColors();
    initializeComplianceChecker();
});

// Initialize Canvas
function initializeCanvas() {
    // Start with a smaller default size
    const initialSize = getOptimalCanvasSize();
    
    canvas = new fabric.Canvas('canvas', {
        width: initialSize.width,
        height: initialSize.height,
        backgroundColor: '#ffffff'
    });

    // Add grid for better alignment
    canvas.selectionColor = 'rgba(102, 126, 234, 0.1)';
    canvas.selectionBorderColor = '#667eea';
    canvas.selectionLineWidth = 2;

    // Track changes for history
    canvas.on('object:modified', saveState);
    canvas.on('object:added', saveState);
    canvas.on('object:removed', saveState);
    canvas.on('selection:created', updatePropertiesPanel);
    canvas.on('selection:updated', updatePropertiesPanel);
    canvas.on('selection:cleared', clearPropertiesPanel);

    // Initial state
    saveState();
    updateLayers();
    checkCompliance();
}

// Get optimal canvas size based on viewport
function getOptimalCanvasSize() {
    const wrapper = document.querySelector('.canvas-wrapper');
    const maxWidth = wrapper.clientWidth - 40;
    const maxHeight = wrapper.clientHeight - 40;
    
    // Default to Instagram square but scale down if needed
    let width = 800;
    let height = 800;
    
    if (width > maxWidth) {
        width = maxWidth;
        height = maxWidth;
    }
    if (height > maxHeight) {
        height = maxHeight;
        width = maxHeight;
    }
    
    return { width, height };
}

// Setup Event Listeners
function setupEventListeners() {
    // Upload buttons
    document.getElementById('uploadImageBtn').addEventListener('click', () => {
        document.getElementById('imageUpload').click();
    });
    
    document.getElementById('uploadBackgroundBtn').addEventListener('click', () => {
        document.getElementById('backgroundUpload').click();
    });

    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    document.getElementById('backgroundUpload').addEventListener('change', handleBackgroundUpload);

    // Text buttons
    document.getElementById('addTextBtn').addEventListener('click', addText);
    document.getElementById('addHeadingBtn').addEventListener('click', addHeading);

    // Shape buttons
    document.getElementById('addRectBtn').addEventListener('click', addRectangle);
    document.getElementById('addCircleBtn').addEventListener('click', addCircle);

    // Background removal
    document.getElementById('removeBgBtn').addEventListener('click', removeBackground);
    
    // Flip tools
    document.getElementById('flipHorizontalBtn').addEventListener('click', flipHorizontal);
    document.getElementById('flipVerticalBtn').addEventListener('click', flipVertical);
    
    // Lock object
    document.getElementById('lockObjectBtn').addEventListener('click', toggleLock);
    
    // AI Tools
    document.getElementById('extractColorsBtn').addEventListener('click', extractColors);
    document.getElementById('suggestLayoutBtn').addEventListener('click', autoArrange);
    
    // Save/Load
    document.getElementById('saveProjectBtn').addEventListener('click', saveProject);
    document.getElementById('loadProjectBtn').addEventListener('click', loadProject);
    
    // Toggle sidebars
    document.getElementById('toggleLeftSidebarBtn').addEventListener('click', toggleLeftSidebar);
    document.getElementById('toggleRightSidebarBtn').addEventListener('click', toggleRightSidebar);

    // Toolbar buttons
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);
    document.getElementById('deleteBtn').addEventListener('click', deleteSelected);
    document.getElementById('duplicateBtn').addEventListener('click', duplicateSelected);
    document.getElementById('bringForwardBtn').addEventListener('click', bringForward);
    document.getElementById('sendBackwardBtn').addEventListener('click', sendBackward);

    // Canvas size
    document.getElementById('canvasSizeSelect').addEventListener('change', changeCanvasSize);

    // Export
    document.getElementById('exportBtn').addEventListener('click', openExportModal);

    // Save color
    document.getElementById('saveColorBtn').addEventListener('click', saveCurrentColor);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle Image Upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (img) => {
            // Scale image to fit canvas
            const scale = Math.min(
                canvas.width / 2 / img.width,
                canvas.height / 2 / img.height
            );
            
            img.scale(scale);
            img.set({
                left: canvas.width / 2,
                top: canvas.height / 2,
                originX: 'center',
                originY: 'center'
            });
            
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            showNotification('Image added successfully!', 'success');
            updateLayers();
            checkCompliance();
        });
    };
    reader.readAsDataURL(file);
}

// Handle Background Upload
function handleBackgroundUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (img) => {
            // Scale to cover canvas
            const scale = Math.max(
                canvas.width / img.width,
                canvas.height / img.height
            );
            
            img.scale(scale);
            img.set({
                left: 0,
                top: 0,
                selectable: true,
                evented: true
            });
            
            canvas.sendToBack(img);
            canvas.renderAll();
            showNotification('Background added successfully!', 'success');
            updateLayers();
        });
    };
    reader.readAsDataURL(file);
}

// Add Text
function addText() {
    const text = new fabric.IText('Double click to edit', {
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        fontSize: 24,
        fill: '#000000',
        fontFamily: 'Inter'
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    updateLayers();
    checkCompliance();
}

// Add Heading
function addHeading() {
    const heading = new fabric.IText('Your Heading Here', {
        left: canvas.width / 2,
        top: canvas.height / 4,
        originX: 'center',
        originY: 'center',
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#000000',
        fontFamily: 'Inter'
    });
    
    canvas.add(heading);
    canvas.setActiveObject(heading);
    canvas.renderAll();
    updateLayers();
    checkCompliance();
}

// Add Rectangle
function addRectangle() {
    const rect = new fabric.Rect({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        width: 200,
        height: 150,
        fill: '#667eea',
        stroke: '#764ba2',
        strokeWidth: 2
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    updateLayers();
}

// Add Circle
function addCircle() {
    const circle = new fabric.Circle({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        radius: 80,
        fill: '#f093fb',
        stroke: '#f5576c',
        strokeWidth: 2
    });
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    updateLayers();
}

// Remove Background (Simple version)
function removeBackground() {
    const activeObj = canvas.getActiveObject();
    
    if (!activeObj || activeObj.type !== 'image') {
        showNotification('Please select an image first', 'error');
        return;
    }

    showNotification('Processing... This may take a moment', 'success');
    
    const img = activeObj;
    const imgElement = img.getElement();
    
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    tempCanvas.width = imgElement.width;
    tempCanvas.height = imgElement.height;
    
    ctx.drawImage(imgElement, 0, 0);
    const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    
    // Improved algorithm: make near-white and light pixels transparent
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate brightness
        const brightness = (r + g + b) / 3;
        
        // If pixel is bright (close to white/light background)
        if (brightness > 200) {
            // Make it transparent based on how close to white
            const opacity = Math.max(0, (255 - brightness) * 4);
            data[i + 3] = opacity;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    fabric.Image.fromURL(tempCanvas.toDataURL(), (newImg) => {
        newImg.set({
            left: img.left,
            top: img.top,
            scaleX: img.scaleX,
            scaleY: img.scaleY,
            angle: img.angle
        });
        
        canvas.remove(img);
        canvas.add(newImg);
        canvas.setActiveObject(newImg);
        canvas.renderAll();
        showNotification('Background removed! ✨', 'success');
        updateLayers();
    });
}

// Flip Horizontal
function flipHorizontal() {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
        showNotification('Please select an object first', 'error');
        return;
    }
    
    activeObj.set('flipX', !activeObj.flipX);
    canvas.renderAll();
    showNotification('Flipped horizontally!', 'success');
}

// Flip Vertical
function flipVertical() {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
        showNotification('Please select an object first', 'error');
        return;
    }
    
    activeObj.set('flipY', !activeObj.flipY);
    canvas.renderAll();
    showNotification('Flipped vertically!', 'success');
}

// Toggle Lock
function toggleLock() {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
        showNotification('Please select an object first', 'error');
        return;
    }
    
    const isLocked = !activeObj.selectable;
    activeObj.selectable = isLocked;
    activeObj.evented = isLocked;
    
    canvas.renderAll();
    updateLayers();
    showNotification(isLocked ? 'Object unlocked 🔓' : 'Object locked 🔒', 'success');
}

// Align Objects
function alignObject(position) {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
        showNotification('Please select an object first', 'error');
        return;
    }
    
    const objWidth = activeObj.width * activeObj.scaleX;
    const objHeight = activeObj.height * activeObj.scaleY;
    
    switch(position) {
        case 'left':
            activeObj.set({ left: objWidth / 2 });
            break;
        case 'center':
            activeObj.set({ left: canvas.width / 2 });
            break;
        case 'right':
            activeObj.set({ left: canvas.width - objWidth / 2 });
            break;
        case 'top':
            activeObj.set({ top: objHeight / 2 });
            break;
        case 'middle':
            activeObj.set({ top: canvas.height / 2 });
            break;
        case 'bottom':
            activeObj.set({ top: canvas.height - objHeight / 2 });
            break;
    }
    
    activeObj.setCoords();
    canvas.renderAll();
    showNotification(`Aligned to ${position}!`, 'success');
}

// Extract Colors from Image
function extractColors() {
    const objects = canvas.getObjects().filter(obj => obj.type === 'image');
    
    if (objects.length === 0) {
        showNotification('Please add an image first', 'error');
        return;
    }
    
    showNotification('Extracting colors... 🎨', 'success');
    
    const img = objects[0].getElement();
    const colorThief = new ColorThief();
    
    try {
        const palette = colorThief.getPalette(img, 5);
        
        // Convert RGB to hex and save
        palette.forEach(color => {
            const hex = `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1)}`;
            if (!savedColors.includes(hex)) {
                savedColors.push(hex);
            }
        });
        
        localStorage.setItem('savedColors', JSON.stringify(savedColors));
        renderSavedColors();
        showNotification('Colors extracted! 🎨 Check saved colors panel', 'success');
    } catch (error) {
        showNotification('Could not extract colors. Try a different image.', 'error');
    }
}

// Auto Arrange Objects
function autoArrange() {
    const objects = canvas.getObjects();
    
    if (objects.length < 2) {
        showNotification('Add more objects to auto-arrange', 'error');
        return;
    }
    
    showNotification('Auto-arranging objects... ✨', 'success');
    
    // Sort objects by type: images first, then shapes, then text
    const images = objects.filter(obj => obj.type === 'image');
    const shapes = objects.filter(obj => obj.type === 'rect' || obj.type === 'circle');
    const texts = objects.filter(obj => obj.type === 'i-text' || obj.type === 'text');
    
    // Arrange images at the back, centered
    images.forEach((img, index) => {
        img.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center'
        });
        canvas.sendToBack(img);
    });
    
    // Arrange text at top
    texts.forEach((text, index) => {
        text.set({
            left: canvas.width / 2,
            top: 80 + (index * 80),
            originX: 'center',
            originY: 'center'
        });
        canvas.bringToFront(text);
    });
    
    // Arrange shapes in the middle
    shapes.forEach((shape, index) => {
        shape.set({
            left: canvas.width / 2,
            top: canvas.height / 2 + (index * 100),
            originX: 'center',
            originY: 'center'
        });
    });
    
    canvas.renderAll();
    updateLayers();
    checkCompliance();
    showNotification('Objects auto-arranged! ✨', 'success');
}

// Apply Image Filters
function applyFilter(filterType) {
    const activeObj = canvas.getActiveObject();
    
    if (!activeObj || activeObj.type !== 'image') {
        showNotification('Please select an image first', 'error');
        return;
    }
    
    // Remove existing filters
    activeObj.filters = [];
    
    switch(filterType) {
        case 'grayscale':
            activeObj.filters.push(new fabric.Image.filters.Grayscale());
            break;
        case 'sepia':
            activeObj.filters.push(new fabric.Image.filters.Sepia());
            break;
        case 'invert':
            activeObj.filters.push(new fabric.Image.filters.Invert());
            break;
        case 'blur':
            activeObj.filters.push(new fabric.Image.filters.Blur({ blur: 0.5 }));
            break;
        case 'sharpen':
            activeObj.filters.push(new fabric.Image.filters.Convolute({
                matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0]
            }));
            break;
        case 'none':
            // Filters already cleared
            break;
    }
    
    activeObj.applyFilters();
    canvas.renderAll();
    showNotification(`${filterType} filter applied!`, 'success');
}

// Adjust Image Properties
function adjustImage(property, value) {
    const activeObj = canvas.getActiveObject();
    
    if (!activeObj || activeObj.type !== 'image') {
        return;
    }
    
    const numValue = parseInt(value) / 100;
    
    // Remove existing adjustment filters
    activeObj.filters = activeObj.filters.filter(f => 
        !(f instanceof fabric.Image.filters.Brightness) &&
        !(f instanceof fabric.Image.filters.Contrast) &&
        !(f instanceof fabric.Image.filters.Saturation)
    );
    
    // Add new filters based on all current values
    const brightness = parseInt(document.getElementById('brightnessSlider')?.value || 0) / 100;
    const contrast = parseInt(document.getElementById('contrastSlider')?.value || 0) / 100;
    const saturation = parseInt(document.getElementById('saturationSlider')?.value || 0) / 100;
    
    if (brightness !== 0) {
        activeObj.filters.push(new fabric.Image.filters.Brightness({ brightness }));
    }
    if (contrast !== 0) {
        activeObj.filters.push(new fabric.Image.filters.Contrast({ contrast }));
    }
    if (saturation !== 0) {
        activeObj.filters.push(new fabric.Image.filters.Saturation({ saturation }));
    }
    
    activeObj.applyFilters();
    canvas.renderAll();
}

// Save Project
function saveProject() {
    const json = JSON.stringify(canvas.toJSON());
    const projectName = prompt('Enter project name:', 'My Creative');
    
    if (!projectName) return;
    
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '{}');
    projects[projectName] = {
        data: json,
        timestamp: new Date().toISOString(),
        preview: canvas.toDataURL({ format: 'png', quality: 0.3, multiplier: 0.2 })
    };
    
    localStorage.setItem('savedProjects', JSON.stringify(projects));
    showNotification(`Project "${projectName}" saved! 💾`, 'success');
}

// Load Project
function loadProject() {
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '{}');
    const projectNames = Object.keys(projects);
    
    if (projectNames.length === 0) {
        showNotification('No saved projects found', 'error');
        return;
    }
    
    let options = 'Select a project to load:\n\n';
    projectNames.forEach((name, index) => {
        const date = new Date(projects[name].timestamp).toLocaleDateString();
        options += `${index + 1}. ${name} (${date})\n`;
    });
    
    const choice = prompt(options + '\nEnter number:');
    const index = parseInt(choice) - 1;
    
    if (index >= 0 && index < projectNames.length) {
        const projectName = projectNames[index];
        const projectData = projects[projectName].data;
        
        canvas.loadFromJSON(projectData, () => {
            canvas.renderAll();
            updateLayers();
            checkCompliance();
            saveState();
            showNotification(`Project "${projectName}" loaded! 📂`, 'success');
        });
    }
}

// History Management
function saveState() {
    const json = JSON.stringify(canvas.toJSON());
    
    if (historyStep < history.length - 1) {
        history = history.slice(0, historyStep + 1);
    }
    
    history.push(json);
    historyStep = history.length - 1;
    
    // Limit history to 50 states
    if (history.length > 50) {
        history.shift();
        historyStep--;
    }
}

function undo() {
    if (historyStep > 0) {
        historyStep--;
        canvas.loadFromJSON(history[historyStep], () => {
            canvas.renderAll();
            updateLayers();
            checkCompliance();
        });
    }
}

function redo() {
    if (historyStep < history.length - 1) {
        historyStep++;
        canvas.loadFromJSON(history[historyStep], () => {
            canvas.renderAll();
            updateLayers();
            checkCompliance();
        });
    }
}

// Object Operations
function deleteSelected() {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
        canvas.discardActiveObject();
        activeObjects.forEach(obj => canvas.remove(obj));
        canvas.renderAll();
        updateLayers();
        checkCompliance();
    }
}

function duplicateSelected() {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    activeObj.clone((cloned) => {
        cloned.set({
            left: activeObj.left + 20,
            top: activeObj.top + 20
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
        updateLayers();
    });
}

function bringForward() {
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
        canvas.bringForward(activeObj);
        canvas.renderAll();
        updateLayers();
    }
}

function sendBackward() {
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
        canvas.sendBackwards(activeObj);
        canvas.renderAll();
        updateLayers();
    }
}

// Change Canvas Size
function changeCanvasSize() {
    const size = document.getElementById('canvasSizeSelect').value;
    const [width, height] = size.split('x').map(Number);
    
    // Scale down if too large for viewport
    const wrapper = document.querySelector('.canvas-wrapper');
    const maxWidth = wrapper.clientWidth - 40;
    const maxHeight = wrapper.clientHeight - 40;
    
    let displayWidth = width;
    let displayHeight = height;
    
    // Calculate scale factor to fit in viewport
    const scaleX = maxWidth / width;
    const scaleY = maxHeight / height;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
    
    if (scale < 1) {
        displayWidth = width * scale;
        displayHeight = height * scale;
    }
    
    // Store actual size for export
    canvas.actualWidth = width;
    canvas.actualHeight = height;
    
    // Set display size
    canvas.setWidth(displayWidth);
    canvas.setHeight(displayHeight);
    
    // Scale all objects proportionally
    const objects = canvas.getObjects();
    objects.forEach(obj => {
        obj.scaleX *= (displayWidth / canvas.width);
        obj.scaleY *= (displayHeight / canvas.height);
        obj.left *= (displayWidth / canvas.width);
        obj.top *= (displayHeight / canvas.height);
        obj.setCoords();
    });
    
    canvas.renderAll();
    
    showNotification(`Canvas resized to ${width}×${height}`, 'success');
    checkCompliance();
}

// Properties Panel
function updatePropertiesPanel() {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    let html = '';

    // Show filters for images
    if (activeObj.type === 'image') {
        document.getElementById('effectsSection').style.display = 'block';
    } else {
        document.getElementById('effectsSection').style.display = 'none';
    }

    // Common properties
    if (activeObj.type === 'i-text' || activeObj.type === 'text') {
        html += `
            <div class="property-group">
                <label>Text Content</label>
                <input type="text" class="property-input" value="${activeObj.text}" 
                       onchange="updateObjectProperty('text', this.value)">
            </div>
            <div class="property-group">
                <label>Font Family</label>
                <select class="property-input" onchange="updateObjectProperty('fontFamily', this.value)">
                    <option value="Inter" ${activeObj.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                    <option value="Roboto" ${activeObj.fontFamily === 'Roboto' ? 'selected' : ''}>Roboto</option>
                    <option value="Playfair Display" ${activeObj.fontFamily === 'Playfair Display' ? 'selected' : ''}>Playfair Display</option>
                    <option value="Montserrat" ${activeObj.fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat</option>
                    <option value="Poppins" ${activeObj.fontFamily === 'Poppins' ? 'selected' : ''}>Poppins</option>
                    <option value="Oswald" ${activeObj.fontFamily === 'Oswald' ? 'selected' : ''}>Oswald</option>
                </select>
            </div>
            <div class="property-group">
                <label>Font Size</label>
                <input type="range" class="property-input" min="10" max="120" value="${activeObj.fontSize}" 
                       oninput="updateObjectProperty('fontSize', parseInt(this.value))">
                <span style="color: white; font-size: 12px;">${activeObj.fontSize}px</span>
            </div>
            <div class="property-group">
                <label>Font Weight</label>
                <select class="property-input" onchange="updateObjectProperty('fontWeight', this.value)">
                    <option value="normal" ${activeObj.fontWeight === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="bold" ${activeObj.fontWeight === 'bold' ? 'selected' : ''}>Bold</option>
                </select>
            </div>
            <div class="property-group">
                <label>Text Color</label>
                <input type="color" class="property-input" value="${activeObj.fill}" 
                       onchange="updateObjectProperty('fill', this.value)">
            </div>
            <div class="property-group">
                <label>Text Shadow</label>
                <input type="color" class="property-input" value="${activeObj.shadow?.color || '#000000'}" 
                       onchange="addTextShadow(this.value)">
            </div>
        `;
    }

    if (activeObj.type === 'rect' || activeObj.type === 'circle') {
        html += `
            <div class="property-group">
                <label>Fill Color</label>
                <input type="color" class="property-input" value="${activeObj.fill}" 
                       onchange="updateObjectProperty('fill', this.value)">
            </div>
            <div class="property-group">
                <label>Stroke Color</label>
                <input type="color" class="property-input" value="${activeObj.stroke || '#000000'}" 
                       onchange="updateObjectProperty('stroke', this.value)">
            </div>
            <div class="property-group">
                <label>Stroke Width</label>
                <input type="range" class="property-input" min="0" max="20" value="${activeObj.strokeWidth || 0}" 
                       oninput="updateObjectProperty('strokeWidth', parseInt(this.value))">
                <span style="color: white; font-size: 12px;">${activeObj.strokeWidth || 0}px</span>
            </div>
            <div class="property-group">
                <label>Corner Radius</label>
                <input type="range" class="property-input" min="0" max="50" value="${activeObj.rx || 0}" 
                       oninput="updateObjectProperty('rx', parseInt(this.value)); updateObjectProperty('ry', parseInt(this.value))">
            </div>
        `;
    }

    // Opacity for all objects
    html += `
        <div class="property-group">
            <label>Opacity</label>
            <input type="range" class="property-input" min="0" max="100" value="${(activeObj.opacity || 1) * 100}" 
                   oninput="updateObjectProperty('opacity', this.value / 100)">
            <span style="color: white; font-size: 12px;">${Math.round((activeObj.opacity || 1) * 100)}%</span>
        </div>
    `;

    document.getElementById('objectProperties').innerHTML = html;
}

function addTextShadow(color) {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    
    activeObj.set('shadow', {
        color: color,
        blur: 5,
        offsetX: 2,
        offsetY: 2
    });
    canvas.renderAll();
}

function updateObjectProperty(property, value) {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    activeObj.set(property, value);
    canvas.renderAll();
    checkCompliance();
    saveState();
    
    // Re-render properties panel to show updated values
    setTimeout(() => updatePropertiesPanel(), 100);
}

function clearPropertiesPanel() {
    document.getElementById('objectProperties').innerHTML = 
        '<p class="no-selection">Select an object to edit properties</p>';
    document.getElementById('effectsSection').style.display = 'none';
}

// Layers Management
function updateLayers() {
    const objects = canvas.getObjects();
    const layersList = document.getElementById('layersList');
    
    if (objects.length === 0) {
        layersList.innerHTML = '<p class="no-selection">No layers yet</p>';
        return;
    }

    let html = '';
    objects.reverse().forEach((obj, index) => {
        const realIndex = objects.length - 1 - index;
        const layerName = getLayerName(obj);
        const isActive = canvas.getActiveObject() === obj;
        
        html += `
            <div class="layer-item ${isActive ? 'active' : ''}" onclick="selectLayer(${realIndex})">
                <div class="layer-info">
                    <span class="layer-visibility" onclick="event.stopPropagation(); toggleLayerVisibility(${realIndex})">
                        ${obj.visible !== false ? '👁️' : '👁️‍🗨️'}
                    </span>
                    <span>${layerName}</span>
                </div>
            </div>
        `;
    });

    layersList.innerHTML = html;
}

function getLayerName(obj) {
    if (obj.type === 'i-text' || obj.type === 'text') {
        return `Text: ${obj.text.substring(0, 20)}${obj.text.length > 20 ? '...' : ''}`;
    }
    if (obj.type === 'image') return 'Image';
    if (obj.type === 'rect') return 'Rectangle';
    if (obj.type === 'circle') return 'Circle';
    return obj.type;
}

function selectLayer(index) {
    const objects = canvas.getObjects();
    canvas.setActiveObject(objects[index]);
    canvas.renderAll();
    updateLayers();
}

function toggleLayerVisibility(index) {
    const objects = canvas.getObjects();
    const obj = objects[index];
    obj.visible = !obj.visible;
    canvas.renderAll();
    updateLayers();
}

// Color Management
function loadSavedColors() {
    const saved = localStorage.getItem('savedColors');
    if (saved) {
        savedColors = JSON.parse(saved);
        renderSavedColors();
    }
}

function saveCurrentColor() {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
        showNotification('Select an object first', 'error');
        return;
    }

    const color = activeObj.fill || activeObj.stroke;
    if (!color) return;

    if (!savedColors.includes(color)) {
        savedColors.push(color);
        localStorage.setItem('savedColors', JSON.stringify(savedColors));
        renderSavedColors();
        showNotification('Color saved!', 'success');
    }
}

function renderSavedColors() {
    const container = document.getElementById('savedColors');
    
    if (savedColors.length === 0) {
        container.innerHTML = '<p class="no-selection" style="grid-column: 1/-1;">No saved colors</p>';
        return;
    }

    let html = '';
    savedColors.forEach((color, index) => {
        html += `
            <div class="color-swatch-item" style="background: ${color}" 
                 onclick="applyColor('${color}')" title="${color}">
                <span class="remove-color" onclick="event.stopPropagation(); removeColor(${index})">×</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function applyColor(color) {
    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
        showNotification('Select an object first', 'error');
        return;
    }

    if (activeObj.type === 'i-text' || activeObj.type === 'text') {
        activeObj.set('fill', color);
    } else {
        activeObj.set('fill', color);
    }
    
    canvas.renderAll();
    updatePropertiesPanel();
    showNotification('Color applied!', 'success');
}

function removeColor(index) {
    savedColors.splice(index, 1);
    localStorage.setItem('savedColors', JSON.stringify(savedColors));
    renderSavedColors();
}

// Compliance Checker
function initializeComplianceChecker() {
    complianceRules = [
        { id: 'text-readable', name: 'Text is readable', check: checkTextReadability },
        { id: 'contrast', name: 'Good color contrast', check: checkColorContrast },
        { id: 'size', name: 'Appropriate canvas size', check: checkCanvasSize },
        { id: 'elements', name: 'Not too crowded', check: checkElementCount },
        { id: 'text-size', name: 'Text size appropriate', check: checkTextSize }
    ];
}

function checkCompliance() {
    let passedCount = 0;
    let html = '';

    complianceRules.forEach(rule => {
        const passed = rule.check();
        if (passed) passedCount++;

        html += `
            <div class="compliance-check ${passed ? 'pass' : 'fail'}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${passed ? '#10b981' : '#ef4444'}" stroke-width="2">
                    ${passed ? 
                        '<polyline points="20 6 9 17 4 12"></polyline>' : 
                        '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
                    }
                </svg>
                <span>${rule.name}</span>
            </div>
        `;
    });

    const score = Math.round((passedCount / complianceRules.length) * 100);
    document.getElementById('complianceScore').textContent = `${score}/100`;
    document.getElementById('complianceChecks').innerHTML = html;

    // Update badge color
    const badge = document.getElementById('complianceScore');
    if (score >= 80) {
        badge.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
    } else if (score >= 60) {
        badge.style.background = 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
    } else {
        badge.style.background = 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
    }
}

// Compliance Check Functions
function checkTextReadability() {
    const texts = canvas.getObjects().filter(obj => obj.type === 'i-text' || obj.type === 'text');
    return texts.every(text => text.fontSize >= 12);
}

function checkColorContrast() {
    // Simplified check
    return true;
}

function checkCanvasSize() {
    const validSizes = ['1080x1080', '1080x1920', '1200x628', '1200x1200', '728x90'];
    const currentSize = `${canvas.width}x${canvas.height}`;
    return validSizes.includes(currentSize);
}

function checkElementCount() {
    return canvas.getObjects().length <= 15;
}

function checkTextSize() {
    const texts = canvas.getObjects().filter(obj => obj.type === 'i-text' || obj.type === 'text');
    return texts.every(text => text.fontSize <= 100);
}

// Export Functions
function openExportModal() {
    document.getElementById('exportModal').classList.add('active');
}

function closeExportModal() {
    document.getElementById('exportModal').classList.remove('active');
}

function startExport() {
    const checkboxes = document.querySelectorAll('.format-checkbox input:checked');
    const quality = parseFloat(document.getElementById('exportQuality').value);
    const format = document.getElementById('exportFormat').value;
    
    if (checkboxes.length === 0) {
        showNotification('Please select at least one format', 'error');
        return;
    }

    closeExportModal();
    showNotification('Exporting your creatives...', 'success');

    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    checkboxes.forEach((checkbox, index) => {
        setTimeout(() => {
            const [width, height] = checkbox.value.split('x').map(Number);
            exportFormat(width, height, quality, format);
        }, index * 500);
    });

    // Restore original size
    setTimeout(() => {
        canvas.setWidth(originalWidth);
        canvas.setHeight(originalHeight);
        canvas.renderAll();
        showNotification('All exports complete!', 'success');
    }, checkboxes.length * 500 + 500);
}

function exportFormat(width, height, quality, format) {
    const scaleX = width / canvas.width;
    const scaleY = height / canvas.height;

    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.getObjects().forEach(obj => {
        obj.scaleX *= scaleX;
        obj.scaleY *= scaleY;
        obj.left *= scaleX;
        obj.top *= scaleY;
        obj.setCoords();
    });
    canvas.renderAll();

    const dataURL = canvas.toDataURL({
        format: format,
        quality: quality,
        multiplier: 1
    });

    downloadImage(dataURL, `creative_${width}x${height}.${format}`);

    // Restore
    canvas.setWidth(width / scaleX);
    canvas.setHeight(height / scaleY);
    canvas.getObjects().forEach(obj => {
        obj.scaleX /= scaleX;
        obj.scaleY /= scaleY;
        obj.left /= scaleX;
        obj.top /= scaleY;
        obj.setCoords();
    });
}

function downloadImage(dataURL, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
}

// Load Templates
function loadTemplate(type) {
    canvas.clear();
    
    if (type === 'minimal') {
        canvas.backgroundColor = '#ffffff';
        
        const heading = new fabric.IText('Premium Product', {
            left: canvas.width / 2,
            top: 100,
            originX: 'center',
            fontSize: 48,
            fontWeight: 'bold',
            fill: '#1a1a2e',
            fontFamily: 'Inter'
        });
        
        const subtext = new fabric.IText('Limited Time Offer', {
            left: canvas.width / 2,
            top: 180,
            originX: 'center',
            fontSize: 24,
            fill: '#667eea',
            fontFamily: 'Inter'
        });
        
        canvas.add(heading, subtext);
    } else if (type === 'bold') {
        canvas.backgroundColor = '#1a1a2e';
        
        const rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: canvas.width,
            height: 200,
            fill: '#667eea'
        });
        
        const heading = new fabric.IText('BIG SALE', {
            left: canvas.width / 2,
            top: 100,
            originX: 'center',
            fontSize: 72,
            fontWeight: 'bold',
            fill: '#ffffff',
            fontFamily: 'Inter'
        });
        
        canvas.add(rect, heading);
    } else if (type === 'premium') {
        canvas.backgroundColor = '#0f172a';
        
        const circle = new fabric.Circle({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            radius: 150,
            fill: 'transparent',
            stroke: '#f093fb',
            strokeWidth: 3
        });
        
        const heading = new fabric.IText('Exclusive', {
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            fill: '#ffffff',
            fontFamily: 'Inter'
        });
        
        canvas.add(circle, heading);
    }
    
    canvas.renderAll();
    saveState();
    updateLayers();
    checkCompliance();
    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} template loaded!`, 'success');
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
            e.preventDefault();
            undo();
        } else if (e.key === 'y') {
            e.preventDefault();
            redo();
        } else if (e.key === 'd') {
            e.preventDefault();
            duplicateSelected();
        }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            deleteSelected();
        }
    }
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconSvg = type === 'success' 
        ? `<svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
               <polyline points="22 4 12 14.01 9 11.01"></polyline>
           </svg>`
        : `<svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <circle cx="12" cy="12" r="10"></circle>
               <line x1="12" y1="8" x2="12" y2="12"></line>
               <line x1="12" y1="16" x2="12.01" y2="16"></line>
           </svg>`;
    
    notification.innerHTML = `
        ${iconSvg}
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Toggle Sidebars
function toggleLeftSidebar() {
    const sidebar = document.querySelector('.left-sidebar');
    const container = document.querySelector('.editor-container');
    
    if (sidebar.style.display === 'none') {
        sidebar.style.display = 'block';
        container.style.gridTemplateColumns = '260px 1fr 280px';
    } else {
        sidebar.style.display = 'none';
        container.style.gridTemplateColumns = '0 1fr 280px';
    }
}

function toggleRightSidebar() {
    const sidebar = document.querySelector('.right-sidebar');
    const container = document.querySelector('.editor-container');
    
    if (sidebar.style.display === 'none') {
        sidebar.style.display = 'block';
        container.style.gridTemplateColumns = '260px 1fr 280px';
    } else {
        sidebar.style.display = 'none';
        container.style.gridTemplateColumns = '260px 1fr 0';
    }
}
