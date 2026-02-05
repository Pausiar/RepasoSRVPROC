// Inicialización del editor CodeMirror
let editor;
let currentExercise = 1;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar CodeMirror
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'text/x-java',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true
    });

    // Cargar ejercicio inicial
    loadExercise(1);

    // Event listeners para navegación de ejercicios
    document.querySelectorAll('.exercise-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const exerciseNum = parseInt(this.dataset.exercise);
            loadExercise(exerciseNum);
            
            // Actualizar botón activo
            document.querySelectorAll('.exercise-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Event listener para botón de pista
    document.getElementById('hint-btn').addEventListener('click', showHint);
    document.getElementById('close-hint').addEventListener('click', closeHint);

    // Event listener para comprobar código
    document.getElementById('check-btn').addEventListener('click', checkCode);

    // Event listener para ver solución
    document.getElementById('solution-btn').addEventListener('click', showSolution);
    document.getElementById('close-solution').addEventListener('click', closeSolution);

    // Event listener para reiniciar
    document.getElementById('reset-btn').addEventListener('click', resetExercise);

    // Cerrar modales al hacer clic fuera
    document.getElementById('hint-modal').addEventListener('click', function(e) {
        if (e.target === this) closeHint();
    });
    document.getElementById('solution-modal').addEventListener('click', function(e) {
        if (e.target === this) closeSolution();
    });

    // Atajo de teclado: Escape para cerrar modales
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeHint();
            closeSolution();
        }
    });
});

// Cargar un ejercicio específico
function loadExercise(num) {
    currentExercise = num;
    const exercise = exercises.find(e => e.id === num);
    
    if (!exercise) return;

    // Actualizar título y descripción
    document.getElementById('exercise-title').textContent = exercise.title;
    document.getElementById('exercise-description').innerHTML = exercise.description;
    
    // Actualizar categoría y puntos
    const categoryEl = document.getElementById('exercise-category');
    categoryEl.textContent = exercise.category;
    categoryEl.className = 'exercise-category ' + (exercise.categoryClass || '');
    
    document.getElementById('exercise-points').textContent = exercise.points;

    // Cargar código inicial en el editor
    editor.setValue(exercise.initialCode);

    // Cargar recordatorios de sintaxis
    document.getElementById('syntax-reminders').innerHTML = exercise.syntaxReminders;

    // Ocultar área de resultados
    document.getElementById('result-area').classList.add('hidden');
    document.getElementById('result-area').className = 'result-area hidden';
}

// Mostrar pista
function showHint() {
    const exercise = exercises.find(e => e.id === currentExercise);
    if (!exercise) return;

    let hintHTML = '<ul>';
    exercise.hints.forEach(hint => {
        hintHTML += `<li>${hint}</li>`;
    });
    hintHTML += '</ul>';

    document.getElementById('hint-content').innerHTML = hintHTML;
    document.getElementById('hint-modal').classList.remove('hidden');
}

// Cerrar pista
function closeHint() {
    document.getElementById('hint-modal').classList.add('hidden');
}

// Comprobar código
function checkCode() {
    const exercise = exercises.find(e => e.id === currentExercise);
    if (!exercise) return;

    const userCode = editor.getValue();
    const resultArea = document.getElementById('result-area');
    const resultTitle = document.getElementById('result-title');
    const resultContent = document.getElementById('result-content');

    // Verificar palabras clave necesarias
    let missingKeywords = [];
    let foundKeywords = [];

    exercise.checkKeywords.forEach(keyword => {
        // Manejar keywords con paréntesis como "lock()" buscando también "lock("
        const searchTerms = [keyword];
        if (keyword.includes('()')) {
            searchTerms.push(keyword.replace('()', '('));
        }
        
        const found = searchTerms.some(term => userCode.includes(term));
        if (found) {
            foundKeywords.push(keyword);
        } else {
            missingKeywords.push(keyword);
        }
    });

    // Verificar si tiene TODOs sin completar
    const hasTodos = userCode.includes('// TODO');

    resultArea.classList.remove('hidden', 'success', 'error', 'info');

    if (missingKeywords.length === 0 && !hasTodos) {
        // Éxito
        resultArea.classList.add('success');
        resultTitle.textContent = '✅ ¡Muy bien!';
        resultContent.innerHTML = `
            <p>Tu código parece correcto. Has incluido los elementos clave:</p>
            <ul>
                ${foundKeywords.map(k => `<li><code>${k}</code> ✓</li>`).join('')}
            </ul>
            <p><strong>Siguiente paso:</strong> Haz clic en "Ver Solución" para comparar tu código con la solución completa y entender cada línea con los comentarios explicativos.</p>
        `;
        
        // Marcar ejercicio como completado
        document.querySelector(`.exercise-btn[data-exercise="${currentExercise}"]`).classList.add('completed');
    } else {
        // Errores
        resultArea.classList.add('error');
        resultTitle.textContent = '⚠️ Revisa tu código';
        
        let errorHTML = '';
        
        if (hasTodos) {
            errorHTML += '<p>❌ Aún tienes comentarios <code>// TODO</code> sin completar.</p>';
        }
        
        if (missingKeywords.length > 0) {
            errorHTML += `
                <p>❌ Faltan elementos importantes:</p>
                <ul>
                    ${missingKeywords.map(k => `<li><code>${k}</code></li>`).join('')}
                </ul>
            `;
        }
        
        if (foundKeywords.length > 0) {
            errorHTML += `
                <p>✓ Elementos correctos encontrados:</p>
                <ul>
                    ${foundKeywords.map(k => `<li><code>${k}</code> ✓</li>`).join('')}
                </ul>
            `;
        }
        
        errorHTML += '<p><strong>💡 Pista:</strong> Haz clic en el botón de la bombilla para obtener ayuda.</p>';
        
        resultContent.innerHTML = errorHTML;
    }
}

// Mostrar solución
function showSolution() {
    const exercise = exercises.find(e => e.id === currentExercise);
    if (!exercise) return;

    // Colorear sintaxis básica en la solución
    let coloredSolution = exercise.solution
        .replace(/\/\/(.*)/g, '<span class="comment">//$1</span>')
        .replace(/\b(public|private|protected|class|static|final|void|return|if|else|for|while|try|catch|finally|new|import|record|var|synchronized|boolean|int|long|true|false|null|this|throws|break|continue)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b(String|Integer|Long|Boolean|Lock|ReentrantLock|AtomicInteger|AtomicLong|AtomicReference|ConcurrentHashMap|CopyOnWriteArrayList|Set|Map|List|ArrayList|LocalDateTime|ChronoUnit|Executors|Thread|Runnable)\b/g, '<span class="type">$1</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

    document.getElementById('solution-code').innerHTML = coloredSolution;
    document.getElementById('solution-modal').classList.remove('hidden');
}

// Cerrar solución
function closeSolution() {
    document.getElementById('solution-modal').classList.add('hidden');
}

// Reiniciar ejercicio
function resetExercise() {
    const exercise = exercises.find(e => e.id === currentExercise);
    if (!exercise) return;

    editor.setValue(exercise.initialCode);
    document.getElementById('result-area').classList.add('hidden');
}

// Función auxiliar para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
