// Definición de todos los ejercicios
const exercises = [
    // ===== EJERCICIO 1: Crear y lanzar hilos =====
    {
        id: 1,
        title: "Ejercicio 1: Crear y lanzar hilos simultáneamente",
        category: "General",
        categoryClass: "",
        points: "Fundamental",
        description: `
            <p><strong>Objetivo:</strong> Aprender a crear y lanzar múltiples hilos que se ejecuten simultáneamente.</p>
            <p>Completa el código para:</p>
            <ul>
                <li>Crear 5 hilos virtuales que impriman su número de hilo</li>
                <li>Usar <code>Executors.newVirtualThreadPerTaskExecutor()</code></li>
                <li>Cada hilo debe imprimir: "Hilo X ejecutándose"</li>
            </ul>
        `,
        initialCode: `import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) {
        // TODO: Crear un executor para hilos virtuales
        // TODO: Lanzar 5 hilos que impriman su número
        
        
    }
}`,
        hints: [
            "Usa <code>try-with-resources</code> con el executor para que se cierre automáticamente",
            "El método <code>executor.submit()</code> acepta un Runnable",
            "Puedes usar una lambda: <code>() -> { ... }</code>",
            "Usa un bucle for para crear los 5 hilos"
        ],
        solution: `import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) {
        // Creamos un executor que crea un hilo virtual por cada tarea
        // try-with-resources asegura que el executor se cierre al terminar
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            
            // Lanzamos 5 hilos simultáneamente
            for (int i = 1; i <= 5; i++) {
                // Necesitamos final o effectively final para usar en lambda
                final int numeroHilo = i;
                
                // submit() envía una tarea (Runnable) al executor
                // La lambda () -> {...} define qué ejecutará cada hilo
                executor.submit(() -> {
                    System.out.println("Hilo " + numeroHilo + " ejecutándose");
                });
            }
            
        } // Al salir del try, el executor espera que terminen todos los hilos
        
        System.out.println("Todos los hilos han terminado");
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>🚀 Crear Executor</h3>
                <pre><code>var executor = Executors
    .newVirtualThreadPerTaskExecutor();</code></pre>
            </div>
            <div class="syntax-section">
                <h3>📦 Patrón try-with-resources</h3>
                <pre><code>try (var executor = Executors
        .newVirtualThreadPerTaskExecutor()) {
    // código aquí
} // auto-close y espera hilos</code></pre>
            </div>
            <div class="syntax-section">
                <h3>▶️ Lanzar tarea</h3>
                <pre><code>executor.submit(() -> {
    // código del hilo
});</code></pre>
            </div>
            <div class="syntax-section">
                <h3>🧵 Alternativa: Thread directo</h3>
                <pre><code>Thread.startVirtualThread(() -> {
    // código
});

// Esperar que termine
thread.join();</code></pre>
            </div>
        `,
        checkKeywords: ["Executors", "newVirtualThreadPerTaskExecutor", "submit", "try"]
    },

    // ===== EJERCICIO 2: Synchronized básico =====
    {
        id: 2,
        title: "Ejercicio 2: Contador con Synchronized",
        category: "Lock/Synchronized",
        categoryClass: "",
        points: "2.5 puntos",
        description: `
            <p><strong>Problema:</strong> El siguiente contador tiene una <em>race condition</em>. Dos hilos incrementan y decrementan, pero el resultado no es 0.</p>
            <p><strong>Tarea:</strong> Corrige el código usando <code>synchronized</code> en los métodos.</p>
        `,
        initialCode: `import java.util.concurrent.Executors;

class Counter {
    int value = 0;

    // TODO: Añade synchronized para evitar race conditions
    public void increment() {
        value++;
    }

    // TODO: Añade synchronized para evitar race conditions
    public void decrement() {
        value--;
    }
}

public class Main {
    public static void main(String[] args) {
        Counter counter = new Counter();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10000; i++) {
                executor.submit(counter::increment);
                executor.submit(counter::decrement);
            }
        }

        // Debería ser 0, pero sin sincronización puede ser cualquier número
        System.out.println("Valor final: " + counter.value);
    }
}`,
        hints: [
            "La palabra clave <code>synchronized</code> va antes del tipo de retorno",
            "Sintaxis: <code>public synchronized void metodo()</code>",
            "Ambos métodos deben estar sincronizados",
            "Al sincronizar, solo un hilo puede ejecutar el método a la vez"
        ],
        solution: `import java.util.concurrent.Executors;

class Counter {
    int value = 0;

    // synchronized evita que dos hilos ejecuten este método simultáneamente
    // Cuando un hilo entra en un método synchronized, adquiere el "lock" del objeto
    // Otros hilos deben esperar hasta que el primero termine
    public synchronized void increment() {
        value++;  // Esta operación ahora es atómica (indivisible)
    }

    // También sincronizado - usa el mismo lock del objeto
    // Si un hilo está en increment(), otro no puede entrar en decrement()
    public synchronized void decrement() {
        value--;
    }
}

public class Main {
    public static void main(String[] args) {
        Counter counter = new Counter();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // Lanzamos 10000 incrementos y 10000 decrementos
            for (int i = 0; i < 10000; i++) {
                executor.submit(counter::increment);
                executor.submit(counter::decrement);
            }
        }

        // Ahora SÍ será 0, porque las operaciones están sincronizadas
        System.out.println("Valor final: " + counter.value);
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>🔒 Método Synchronized</h3>
                <pre><code>public synchronized void metodo() {
    // Solo un hilo a la vez
}</code></pre>
                <div class="syntax-note">⚠️ El lock es sobre el objeto, no sobre el método</div>
            </div>
            <div class="syntax-section">
                <h3>🔒 Bloque Synchronized</h3>
                <pre><code>synchronized(objeto) {
    // código sincronizado
}</code></pre>
            </div>
            <div class="syntax-section">
                <h3>⚡ Efectos de synchronized</h3>
                <div class="syntax-note">
                    1. Exclusión mutua (solo 1 hilo)<br>
                    2. Visibilidad de memoria garantizada
                </div>
            </div>
        `,
        checkKeywords: ["synchronized"]
    },

    // ===== EJERCICIO 3: AtomicInteger básico =====
    {
        id: 3,
        title: "Ejercicio 3: Contador con AtomicInteger",
        category: "Atomic Variables",
        categoryClass: "atomic",
        points: "2.5 puntos",
        description: `
            <p><strong>Tarea:</strong> Reimplementa el contador del ejercicio anterior usando <code>AtomicInteger</code> en lugar de <code>synchronized</code>.</p>
            <ul>
                <li>Declara <code>value</code> como <code>AtomicInteger</code></li>
                <li>Usa <code>incrementAndGet()</code> y <code>decrementAndGet()</code></li>
            </ul>
        `,
        initialCode: `import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

class Counter {
    // TODO: Cambiar int por AtomicInteger
    int value = 0;

    public void increment() {
        // TODO: Usar método atómico de incremento
        value++;
    }

    public void decrement() {
        // TODO: Usar método atómico de decremento
        value--;
    }
    
    public int getValue() {
        // TODO: Obtener valor del AtomicInteger
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Counter counter = new Counter();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10000; i++) {
                executor.submit(counter::increment);
                executor.submit(counter::decrement);
            }
        }

        System.out.println("Valor final: " + counter.getValue());
    }
}`,
        hints: [
            "Inicializa con: <code>AtomicInteger value = new AtomicInteger(0);</code>",
            "Para incrementar: <code>value.incrementAndGet()</code>",
            "Para decrementar: <code>value.decrementAndGet()</code>",
            "Para obtener el valor: <code>value.get()</code>"
        ],
        solution: `import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

class Counter {
    // AtomicInteger proporciona operaciones atómicas sin necesidad de synchronized
    // Internamente usa instrucciones CAS (Compare-And-Swap) del procesador
    AtomicInteger value = new AtomicInteger(0);

    public void increment() {
        // incrementAndGet() incrementa y retorna el nuevo valor
        // Esta operación es ATÓMICA - no puede ser interrumpida
        value.incrementAndGet();
        // Alternativa: getAndIncrement() retorna el valor ANTES de incrementar
    }

    public void decrement() {
        // decrementAndGet() decrementa y retorna el nuevo valor
        value.decrementAndGet();
    }
    
    public int getValue() {
        // get() obtiene el valor actual de forma thread-safe
        return value.get();
    }
}

public class Main {
    public static void main(String[] args) {
        Counter counter = new Counter();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10000; i++) {
                executor.submit(counter::increment);
                executor.submit(counter::decrement);
            }
        }

        // Resultado correcto: 0
        // AtomicInteger es más eficiente que synchronized para operaciones simples
        System.out.println("Valor final: " + counter.getValue());
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>⚛️ Crear AtomicInteger</h3>
                <pre><code>AtomicInteger ai = new AtomicInteger(0);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>⚛️ Métodos principales</h3>
                <div class="syntax-method">
                    <span class="method-name">get()</span>
                    <div class="method-desc">Obtiene el valor actual</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">set(int newValue)</span>
                    <div class="method-desc">Establece un nuevo valor</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">incrementAndGet()</span>
                    <div class="method-desc">++value (incrementa y retorna)</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">getAndIncrement()</span>
                    <div class="method-desc">value++ (retorna e incrementa)</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">decrementAndGet()</span>
                    <div class="method-desc">--value</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">addAndGet(int delta)</span>
                    <div class="method-desc">value += delta</div>
                </div>
            </div>
        `,
        checkKeywords: ["AtomicInteger", "incrementAndGet", "decrementAndGet", "get"]
    },

    // ===== EJERCICIO 4: AtomicInteger - compareAndSet =====
    {
        id: 4,
        title: "Ejercicio 4: Control de Acceso con AtomicInteger",
        category: "Atomic Variables",
        categoryClass: "atomic",
        points: "2.5 puntos",
        description: `
            <p><strong>Escenario:</strong> Sistema de control de acceso con máximo 3 usuarios conectados simultáneamente.</p>
            <p><strong>Implementa:</strong></p>
            <ul>
                <li><code>connect()</code>: Incrementa si no se supera el límite. Retorna true/false.</li>
                <li><code>disconnect()</code>: Decrementa asegurando que no sea negativo.</li>
            </ul>
            <p>Usa <code>compareAndSet()</code> o <code>updateAndGet()</code></p>
        `,
        initialCode: `import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

class AccessControl {
    private final int MAX_USERS = 3;
    private AtomicInteger currentUsers = new AtomicInteger(0);

    // TODO: Implementar connect()
    // Debe incrementar currentUsers si < MAX_USERS
    // Retorna true si se conectó, false si está lleno
    public boolean connect() {
        
        return false;
    }

    // TODO: Implementar disconnect()
    // Debe decrementar currentUsers pero nunca ser negativo
    public void disconnect() {
        
    }

    public int getCurrentUsers() {
        return currentUsers.get();
    }
}

public class Main {
    public static void main(String[] args) {
        AccessControl access = new AccessControl();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // 10 usuarios intentan conectarse
            for (int i = 1; i <= 10; i++) {
                final int userId = i;
                executor.submit(() -> {
                    if (access.connect()) {
                        System.out.println("Usuario " + userId + " conectado");
                    } else {
                        System.out.println("Usuario " + userId + " rechazado - lleno");
                    }
                });
            }
        }

        System.out.println("Usuarios conectados: " + access.getCurrentUsers());
    }
}`,
        hints: [
            "Para connect() usa un bucle con <code>compareAndSet(expected, newValue)</code>",
            "O usa <code>updateAndGet(current -> current < MAX ? current + 1 : current)</code>",
            "Para disconnect() usa <code>updateAndGet(current -> Math.max(0, current - 1))</code>",
            "compareAndSet retorna true si el cambio se realizó"
        ],
        solution: `import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

class AccessControl {
    private final int MAX_USERS = 3;
    private AtomicInteger currentUsers = new AtomicInteger(0);

    public boolean connect() {
        // OPCIÓN 1: Usando compareAndSet en un bucle
        // Este patrón es común para operaciones condicionales atómicas
        while (true) {
            int current = currentUsers.get();  // Leer valor actual
            
            if (current >= MAX_USERS) {
                return false;  // Ya está lleno, no se puede conectar
            }
            
            // Intentar cambiar de 'current' a 'current + 1'
            // Si otro hilo modificó el valor, compareAndSet retorna false
            // y el bucle reintenta con el nuevo valor
            if (currentUsers.compareAndSet(current, current + 1)) {
                return true;  // ¡Éxito! Se incrementó
            }
            // Si falló, el bucle reintenta automáticamente
        }
        
        // OPCIÓN 2 (alternativa más elegante): Usando updateAndGet
        // int result = currentUsers.updateAndGet(current -> 
        //     current < MAX_USERS ? current + 1 : current
        // );
        // return result <= MAX_USERS && result > 0;
    }

    public void disconnect() {
        // updateAndGet aplica la función y retorna el nuevo valor
        // Math.max(0, current - 1) asegura que nunca sea negativo
        currentUsers.updateAndGet(current -> Math.max(0, current - 1));
    }

    public int getCurrentUsers() {
        return currentUsers.get();
    }
}

public class Main {
    public static void main(String[] args) {
        AccessControl access = new AccessControl();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 1; i <= 10; i++) {
                final int userId = i;
                executor.submit(() -> {
                    if (access.connect()) {
                        System.out.println("Usuario " + userId + " conectado");
                    } else {
                        System.out.println("Usuario " + userId + " rechazado - lleno");
                    }
                });
            }
        }

        // Solo habrá 3 usuarios conectados (MAX_USERS)
        System.out.println("Usuarios conectados: " + access.getCurrentUsers());
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>⚛️ compareAndSet</h3>
                <pre><code>// Cambia valor SI el actual == expected
boolean ok = ai.compareAndSet(
    expected,  // valor esperado
    newValue   // nuevo valor
);
// Retorna true si cambió</code></pre>
            </div>
            <div class="syntax-section">
                <h3>⚛️ updateAndGet</h3>
                <pre><code>// Aplica función y retorna nuevo valor
int nuevo = ai.updateAndGet(
    current -> current + 10
);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>⚛️ getAndUpdate</h3>
                <pre><code>// Aplica función y retorna valor ANTERIOR
int anterior = ai.getAndUpdate(
    current -> current * 2
);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>🔄 Patrón CAS (Compare-And-Swap)</h3>
                <pre><code>while (true) {
    int current = ai.get();
    int next = calcular(current);
    if (ai.compareAndSet(current, next))
        break;
}</code></pre>
            </div>
        `,
        checkKeywords: ["compareAndSet", "updateAndGet", "MAX_USERS"]
    },

    // ===== EJERCICIO 5: AtomicReference =====
    {
        id: 5,
        title: "Ejercicio 5: Perfil de Usuario con AtomicReference",
        category: "Atomic Variables",
        categoryClass: "atomic",
        points: "2.5 puntos",
        description: `
            <p><strong>Tarea:</strong> Gestionar actualizaciones atómicas de un perfil de usuario.</p>
            <ul>
                <li>Crea un record <code>UserProfile(String name, int age)</code></li>
                <li>Usa <code>AtomicReference&lt;UserProfile&gt;</code></li>
                <li>Implementa <code>updateProfile(newName, newAge)</code> usando <code>set()</code></li>
                <li>Implementa <code>updateIfMatch(expected, newProfile)</code> usando <code>compareAndSet()</code></li>
            </ul>
        `,
        initialCode: `import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicReference;

// TODO: Crear record UserProfile con name y age
record UserProfile(String name, int age) {}

class UserProfileUpdater {
    // TODO: Crear AtomicReference<UserProfile> inicializado con ("Juan", 25)
    
    
    // TODO: updateProfile(String newName, int newAge) - usa set()
    public void updateProfile(String newName, int newAge) {
        
    }

    // TODO: updateIfMatch - usa compareAndSet()
    // Solo actualiza si el perfil actual coincide con expected
    public boolean updateIfMatch(UserProfile expected, UserProfile newProfile) {
        
        return false;
    }

    public UserProfile getProfile() {
        // TODO: retornar el perfil actual
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        UserProfileUpdater updater = new UserProfileUpdater();
        
        System.out.println("Perfil inicial: " + updater.getProfile());
        
        // Actualización simple
        updater.updateProfile("María", 30);
        System.out.println("Después de updateProfile: " + updater.getProfile());
        
        // Actualización condicional
        UserProfile current = updater.getProfile();
        boolean success = updater.updateIfMatch(current, new UserProfile("Pedro", 35));
        System.out.println("updateIfMatch exitoso: " + success);
        System.out.println("Perfil final: " + updater.getProfile());
    }
}`,
        hints: [
            "Inicializa: <code>AtomicReference&lt;UserProfile&gt; profile = new AtomicReference&lt;&gt;(new UserProfile(\"Juan\", 25));</code>",
            "Para set(): <code>profile.set(new UserProfile(newName, newAge));</code>",
            "Para compareAndSet(): <code>return profile.compareAndSet(expected, newProfile);</code>",
            "Para get(): <code>return profile.get();</code>"
        ],
        solution: `import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicReference;

// record es inmutable - perfecto para uso con AtomicReference
// Cada actualización crea un nuevo objeto, no modifica el existente
record UserProfile(String name, int age) {}

class UserProfileUpdater {
    // AtomicReference permite actualizar referencias de forma atómica
    // Útil cuando necesitas actualizar objetos complejos de forma thread-safe
    private AtomicReference<UserProfile> profile = 
        new AtomicReference<>(new UserProfile("Juan", 25));

    // set() - Actualización incondicional
    // Simplemente reemplaza el valor actual por uno nuevo
    public void updateProfile(String newName, int newAge) {
        // Creamos un nuevo UserProfile (los records son inmutables)
        profile.set(new UserProfile(newName, newAge));
    }

    // compareAndSet() - Actualización condicional
    // Solo actualiza si el valor actual es exactamente igual a expected
    // Útil para evitar "lost updates" en entornos concurrentes
    public boolean updateIfMatch(UserProfile expected, UserProfile newProfile) {
        // Compara por referencia (==) no por equals()
        // Si el perfil actual == expected, lo cambia a newProfile
        return profile.compareAndSet(expected, newProfile);
    }

    public UserProfile getProfile() {
        // get() retorna la referencia actual de forma thread-safe
        return profile.get();
    }
}

public class Main {
    public static void main(String[] args) {
        UserProfileUpdater updater = new UserProfileUpdater();
        
        System.out.println("Perfil inicial: " + updater.getProfile());
        // Output: UserProfile[name=Juan, age=25]
        
        // Actualización simple con set()
        updater.updateProfile("María", 30);
        System.out.println("Después de updateProfile: " + updater.getProfile());
        // Output: UserProfile[name=María, age=30]
        
        // Actualización condicional con compareAndSet()
        UserProfile current = updater.getProfile();  // Guardamos referencia actual
        boolean success = updater.updateIfMatch(current, new UserProfile("Pedro", 35));
        System.out.println("updateIfMatch exitoso: " + success);  // true
        System.out.println("Perfil final: " + updater.getProfile());
        // Output: UserProfile[name=Pedro, age=35]
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>⚛️ Crear AtomicReference</h3>
                <pre><code>AtomicReference&lt;MiClase&gt; ref = 
    new AtomicReference&lt;&gt;(valorInicial);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>⚛️ Métodos AtomicReference</h3>
                <div class="syntax-method">
                    <span class="method-name">get()</span>
                    <div class="method-desc">Obtiene la referencia actual</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">set(V newValue)</span>
                    <div class="method-desc">Establece nuevo valor</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">compareAndSet(V expect, V update)</span>
                    <div class="method-desc">Cambia solo si actual == expect</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">getAndSet(V newValue)</span>
                    <div class="method-desc">Establece y retorna el anterior</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">updateAndGet(UnaryOperator&lt;V&gt;)</span>
                    <div class="method-desc">Aplica función y retorna nuevo</div>
                </div>
            </div>
            <div class="syntax-section">
                <h3>💡 Tip: Records</h3>
                <pre><code>record UserProfile(
    String name, 
    int age
) {}</code></pre>
                <div class="syntax-note">Records son inmutables, ideales para AtomicReference</div>
            </div>
        `,
        checkKeywords: ["AtomicReference", "UserProfile", "set", "compareAndSet", "get"]
    },

    // ===== EJERCICIO 6: Lock estructura básica =====
    {
        id: 6,
        title: "Ejercicio 6: Estructura básica de Lock",
        category: "Lock/Synchronized",
        categoryClass: "",
        points: "2.5 puntos",
        description: `
            <p><strong>Tarea:</strong> Implementa un contador thread-safe usando <code>ReentrantLock</code>.</p>
            <ul>
                <li>Crea un <code>Lock</code> con <code>new ReentrantLock()</code></li>
                <li>Usa <code>lock.lock()</code> antes de modificar el valor</li>
                <li>Usa <code>lock.unlock()</code> en el bloque <code>finally</code></li>
            </ul>
        `,
        initialCode: `import java.util.concurrent.Executors;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class SafeCounter {
    private int value = 0;
    // TODO: Crear el Lock
    
    
    public void increment() {
        // TODO: Adquirir lock, incrementar, liberar en finally
        
    }

    public void decrement() {
        // TODO: Adquirir lock, decrementar, liberar en finally
        
    }

    public int getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        SafeCounter counter = new SafeCounter();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10000; i++) {
                executor.submit(counter::increment);
                executor.submit(counter::decrement);
            }
        }

        System.out.println("Valor final: " + counter.getValue());
    }
}`,
        hints: [
            "Declara: <code>private Lock lock = new ReentrantLock();</code>",
            "Estructura: <code>lock.lock(); try { ... } finally { lock.unlock(); }</code>",
            "El <code>finally</code> asegura que el lock se libere aunque haya excepción",
            "No pongas <code>lock.lock()</code> dentro del try (si falla, unlock daría error)"
        ],
        solution: `import java.util.concurrent.Executors;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class SafeCounter {
    private int value = 0;
    
    // ReentrantLock permite que el mismo hilo adquiera el lock múltiples veces
    // "Reentrant" significa que si ya tienes el lock, puedes volver a adquirirlo
    private Lock lock = new ReentrantLock();
    
    // Alternativa con política justa (FIFO): new ReentrantLock(true)
    
    public void increment() {
        // IMPORTANTE: lock.lock() va FUERA del try
        // Si estuviera dentro y fallara, el finally haría unlock() sin tener el lock
        lock.lock();
        try {
            value++;  // Sección crítica protegida
        } finally {
            // SIEMPRE liberar en finally para garantizar que se libere
            // incluso si hay una excepción en la sección crítica
            lock.unlock();
        }
    }

    public void decrement() {
        lock.lock();
        try {
            value--;
        } finally {
            lock.unlock();  // Liberar SIEMPRE, pase lo que pase
        }
    }

    public int getValue() {
        // Para lectura simple, podríamos no usar lock
        // pero si queremos consistencia total, deberíamos usarlo
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        SafeCounter counter = new SafeCounter();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10000; i++) {
                executor.submit(counter::increment);
                executor.submit(counter::decrement);
            }
        }

        // Resultado: 0 (correcto gracias al Lock)
        System.out.println("Valor final: " + counter.getValue());
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>🔐 Crear Lock</h3>
                <pre><code>// Sin política justa
Lock lock = new ReentrantLock();

// Con política justa (FIFO)
Lock lock = new ReentrantLock(true);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>🔐 Estructura básica</h3>
                <pre><code>lock.lock();       // Adquirir (bloquea)
try {
    // sección crítica
} finally {
    lock.unlock(); // SIEMPRE liberar
}</code></pre>
                <div class="syntax-note">⚠️ lock() FUERA del try</div>
            </div>
            <div class="syntax-section">
                <h3>🔐 Métodos de Lock</h3>
                <div class="syntax-method">
                    <span class="method-name">lock()</span>
                    <div class="method-desc">Adquiere, espera si está ocupado</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">unlock()</span>
                    <div class="method-desc">Libera el lock</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">tryLock()</span>
                    <div class="method-desc">Intenta adquirir, no espera</div>
                </div>
            </div>
        `,
        checkKeywords: ["ReentrantLock", "lock()", "unlock()", "finally"]
    },

    // ===== EJERCICIO 7: Lock con tryLock =====
    {
        id: 7,
        title: "Ejercicio 7: Lock con tryLock()",
        category: "Lock/Synchronized",
        categoryClass: "",
        points: "2.5 puntos",
        description: `
            <p><strong>Escenario:</strong> Dos recursos que deben bloquearse juntos para una transferencia.</p>
            <p><strong>Implementa:</strong> <code>transferir()</code> que:</p>
            <ul>
                <li>Intenta adquirir ambos locks con <code>tryLock()</code></li>
                <li>Solo transfiere si consigue AMBOS locks</li>
                <li>Libera los locks que haya conseguido en el <code>finally</code></li>
            </ul>
        `,
        initialCode: `import java.util.concurrent.Executors;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class Cuenta {
    private int saldo;
    private Lock lock = new ReentrantLock();

    public Cuenta(int saldoInicial) {
        this.saldo = saldoInicial;
    }

    public Lock getLock() { return lock; }
    public int getSaldo() { return saldo; }
    public void depositar(int cantidad) { saldo += cantidad; }
    public void retirar(int cantidad) { saldo -= cantidad; }
}

class Banco {
    // TODO: Implementar transferir usando tryLock() en ambas cuentas
    // Si no consigue ambos locks, no hace nada y retorna false
    public boolean transferir(Cuenta origen, Cuenta destino, int cantidad) {
        boolean lockOrigenAdquirido = false;
        boolean lockDestinoAdquirido = false;
        
        try {
            // TODO: Intentar adquirir ambos locks
            
            
            // TODO: Si ambos adquiridos, hacer la transferencia
            
            
            return false;
        } finally {
            // TODO: Liberar los locks que se hayan adquirido
            
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Cuenta cuenta1 = new Cuenta(1000);
        Cuenta cuenta2 = new Cuenta(1000);
        Banco banco = new Banco();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 100; i++) {
                executor.submit(() -> banco.transferir(cuenta1, cuenta2, 10));
                executor.submit(() -> banco.transferir(cuenta2, cuenta1, 10));
            }
        }

        System.out.println("Saldo cuenta 1: " + cuenta1.getSaldo());
        System.out.println("Saldo cuenta 2: " + cuenta2.getSaldo());
        System.out.println("Total: " + (cuenta1.getSaldo() + cuenta2.getSaldo()));
    }
}`,
        hints: [
            "<code>tryLock()</code> retorna <code>true</code> si consigue el lock, <code>false</code> si no",
            "Guarda el resultado en boolean: <code>lockOrigenAdquirido = origen.getLock().tryLock();</code>",
            "En el finally: <code>if (lockOrigenAdquirido) origen.getLock().unlock();</code>",
            "Solo transfiere si <code>lockOrigenAdquirido && lockDestinoAdquirido</code>"
        ],
        solution: `import java.util.concurrent.Executors;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class Cuenta {
    private int saldo;
    private Lock lock = new ReentrantLock();

    public Cuenta(int saldoInicial) {
        this.saldo = saldoInicial;
    }

    public Lock getLock() { return lock; }
    public int getSaldo() { return saldo; }
    public void depositar(int cantidad) { saldo += cantidad; }
    public void retirar(int cantidad) { saldo -= cantidad; }
}

class Banco {
    // tryLock() evita deadlocks: si no puede adquirir ambos locks, no espera
    public boolean transferir(Cuenta origen, Cuenta destino, int cantidad) {
        // Flags para saber qué locks hemos adquirido
        boolean lockOrigenAdquirido = false;
        boolean lockDestinoAdquirido = false;
        
        try {
            // tryLock() intenta adquirir el lock SIN ESPERAR
            // Retorna true si lo consigue, false si ya está ocupado
            lockOrigenAdquirido = origen.getLock().tryLock();
            lockDestinoAdquirido = destino.getLock().tryLock();
            
            // Solo procedemos si conseguimos AMBOS locks
            if (lockOrigenAdquirido && lockDestinoAdquirido) {
                // Sección crítica: tenemos ambos locks
                origen.retirar(cantidad);
                destino.depositar(cantidad);
                return true;  // Transferencia exitosa
            }
            
            // Si no conseguimos ambos, retornamos false
            // Los locks adquiridos se liberan en el finally
            return false;
            
        } finally {
            // IMPORTANTE: Solo liberar los locks que realmente adquirimos
            // Si no comprobamos, unlock() en un lock no adquirido lanza excepción
            if (lockDestinoAdquirido) {
                destino.getLock().unlock();
            }
            if (lockOrigenAdquirido) {
                origen.getLock().unlock();
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Cuenta cuenta1 = new Cuenta(1000);
        Cuenta cuenta2 = new Cuenta(1000);
        Banco banco = new Banco();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // Transferencias simultáneas en ambas direcciones
            for (int i = 0; i < 100; i++) {
                executor.submit(() -> banco.transferir(cuenta1, cuenta2, 10));
                executor.submit(() -> banco.transferir(cuenta2, cuenta1, 10));
            }
        }

        // El total siempre debe ser 2000 (conservación del dinero)
        System.out.println("Saldo cuenta 1: " + cuenta1.getSaldo());
        System.out.println("Saldo cuenta 2: " + cuenta2.getSaldo());
        System.out.println("Total: " + (cuenta1.getSaldo() + cuenta2.getSaldo()));
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>🔐 tryLock() básico</h3>
                <pre><code>boolean adquirido = lock.tryLock();
// true = lo tienes
// false = está ocupado</code></pre>
            </div>
            <div class="syntax-section">
                <h3>🔐 Patrón tryLock seguro</h3>
                <pre><code>boolean lock1Ok = false;
boolean lock2Ok = false;

try {
    lock1Ok = lock1.tryLock();
    lock2Ok = lock2.tryLock();
    
    if (lock1Ok && lock2Ok) {
        // código seguro
    }
} finally {
    if (lock2Ok) lock2.unlock();
    if (lock1Ok) lock1.unlock();
}</code></pre>
            </div>
            <div class="syntax-section">
                <h3>⏱️ tryLock con timeout</h3>
                <pre><code>// Espera máximo 1 segundo
boolean ok = lock.tryLock(
    1, TimeUnit.SECONDS
);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>💡 Ventaja de tryLock</h3>
                <div class="syntax-note">
                    Evita deadlocks porque no espera indefinidamente.
                    Si no consigue todos los locks, libera los que tiene y reintenta.
                </div>
            </div>
        `,
        checkKeywords: ["tryLock", "finally", "if (lock", "unlock"]
    },

    // ===== EJERCICIO 8: ConcurrentHashMap básico =====
    {
        id: 8,
        title: "Ejercicio 8: Histograma con ConcurrentHashMap",
        category: "Concurrent Collections",
        categoryClass: "concurrent",
        points: "5 puntos",
        description: `
            <p><strong>Tarea:</strong> Cuenta las ocurrencias de cada fruta usando múltiples hilos.</p>
            <ul>
                <li>Usa <code>ConcurrentHashMap&lt;String, Integer&gt;</code></li>
                <li>Divide el array en 4 partes, un hilo por parte</li>
                <li>Usa <code>merge()</code> para incrementar contadores de forma segura</li>
            </ul>
        `,
        initialCode: `import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) {
        String[] frutas = {
            "manzana", "pera", "naranja", "uva", "manzana", "naranja", "naranja", "uva",
            "naranja", "manzana", "naranja", "uva", "manzana", "naranja", "naranja", "uva",
            "manzana", "naranja", "naranja", "uva", "naranja", "manzana", "naranja", "uva",
            "pera", "naranja", "pera", "naranja", "uva", "naranja", "naranja", "manzana"
        };

        // TODO: Crear ConcurrentHashMap para el histograma
        
        
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            int partSize = frutas.length / 4;
            
            for (int i = 0; i < 4; i++) {
                final int start = i * partSize;
                final int end = (i == 3) ? frutas.length : start + partSize;
                
                executor.submit(() -> {
                    // TODO: Contar frutas desde start hasta end
                    // Usar merge() para incrementar el contador
                    
                });
            }
        }

        // TODO: Imprimir resultados
        System.out.println("Histograma:");
        
    }
}`,
        hints: [
            "Crea: <code>ConcurrentHashMap&lt;String, Integer&gt; histograma = new ConcurrentHashMap&lt;&gt;();</code>",
            "<code>merge(key, 1, Integer::sum)</code> suma 1 al valor actual (o pone 1 si no existe)",
            "Para imprimir: <code>histograma.forEach((k, v) -> System.out.println(k + \": \" + v));</code>",
            "merge() es atómico - seguro para múltiples hilos"
        ],
        solution: `import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) {
        String[] frutas = {
            "manzana", "pera", "naranja", "uva", "manzana", "naranja", "naranja", "uva",
            "naranja", "manzana", "naranja", "uva", "manzana", "naranja", "naranja", "uva",
            "manzana", "naranja", "naranja", "uva", "naranja", "manzana", "naranja", "uva",
            "pera", "naranja", "pera", "naranja", "uva", "naranja", "naranja", "manzana"
        };

        // ConcurrentHashMap es thread-safe para operaciones concurrentes
        // A diferencia de HashMap, múltiples hilos pueden leer/escribir simultáneamente
        ConcurrentHashMap<String, Integer> histograma = new ConcurrentHashMap<>();
        
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            int partSize = frutas.length / 4;  // 8 elementos por hilo
            
            // Lanzamos 4 hilos, cada uno procesa una parte del array
            for (int i = 0; i < 4; i++) {
                final int start = i * partSize;
                // El último hilo toma el resto (por si no es divisible exacto)
                final int end = (i == 3) ? frutas.length : start + partSize;
                
                executor.submit(() -> {
                    // Cada hilo procesa su sección del array
                    for (int j = start; j < end; j++) {
                        String fruta = frutas[j];
                        
                        // merge() es ATÓMICO - perfecto para contadores
                        // Si la clave no existe: pone el valor (1)
                        // Si existe: aplica la función (Integer::sum) al valor actual y 1
                        histograma.merge(fruta, 1, Integer::sum);
                        
                        // Equivalente manual (NO atómico, no usar):
                        // histograma.put(fruta, histograma.getOrDefault(fruta, 0) + 1);
                    }
                });
            }
        }

        // forEach también es thread-safe en ConcurrentHashMap
        System.out.println("Histograma:");
        histograma.forEach((fruta, cantidad) -> 
            System.out.println(fruta + ": " + cantidad)
        );
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>🗺️ Crear ConcurrentHashMap</h3>
                <pre><code>ConcurrentHashMap&lt;K, V&gt; map = 
    new ConcurrentHashMap&lt;&gt;();</code></pre>
            </div>
            <div class="syntax-section">
                <h3>🗺️ merge() - Clave para contadores</h3>
                <pre><code>// Si no existe: pone value
// Si existe: aplica función
map.merge(key, value, (old, v) -> old + v);

// Para contar:
map.merge("item", 1, Integer::sum);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>🗺️ Otros métodos importantes</h3>
                <div class="syntax-method">
                    <span class="method-name">putIfAbsent(K, V)</span>
                    <div class="method-desc">Pone solo si no existe</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">computeIfAbsent(K, Function)</span>
                    <div class="method-desc">Calcula valor si no existe</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">compute(K, BiFunction)</span>
                    <div class="method-desc">Calcula nuevo valor siempre</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">forEach(BiConsumer)</span>
                    <div class="method-desc">Itera de forma segura</div>
                </div>
            </div>
        `,
        checkKeywords: ["ConcurrentHashMap", "merge", "Integer::sum"]
    },

    // ===== EJERCICIO 9: ConcurrentHashMap - compute =====
    {
        id: 9,
        title: "Ejercicio 9: Grupos de Chat con ConcurrentHashMap",
        category: "Concurrent Collections",
        categoryClass: "concurrent",
        points: "5 puntos",
        description: `
            <p><strong>Implementa</strong> un gestor de grupos de chat con estos métodos:</p>
            <ul>
                <li><code>addUserToGroup(user, group)</code>: Añade usuario al grupo (crea grupo si no existe). Retorna false si ya estaba.</li>
                <li><code>removeUserFromGroup(user, group)</code>: Quita usuario. Si el grupo queda vacío, lo elimina. Retorna false si no estaba.</li>
                <li><code>deleteGroup(group)</code>: Elimina un grupo. Retorna false si no existía.</li>
            </ul>
            <p>Usa <code>ConcurrentHashMap&lt;String, Set&lt;String&gt;&gt;</code></p>
        `,
        initialCode: `import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

class GroupsManager {
    // TODO: Map de grupo -> Set de usuarios
    // Usa ConcurrentHashMap.newKeySet() para crear Sets thread-safe
    
    
    // TODO: addUserToGroup - usa computeIfAbsent para crear el Set si no existe
    public boolean addUserToGroup(String user, String group) {
        
        return false;
    }

    // TODO: removeUserFromGroup - quita usuario, elimina grupo si queda vacío
    public boolean removeUserFromGroup(String user, String group) {
        
        return false;
    }

    // TODO: deleteGroup - elimina el grupo completo
    public boolean deleteGroup(String group) {
        
        return false;
    }

    public void printGroups() {
        groups.forEach((g, users) -> 
            System.out.println(g + ": " + users));
    }
}

public class Main {
    public static void main(String[] args) {
        GroupsManager manager = new GroupsManager();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            executor.submit(() -> manager.addUserToGroup("Ana", "grupo1"));
            executor.submit(() -> manager.addUserToGroup("Bob", "grupo1"));
            executor.submit(() -> manager.addUserToGroup("Ana", "grupo2"));
            executor.submit(() -> manager.addUserToGroup("Carlos", "grupo2"));
        }

        manager.printGroups();
    }
}`,
        hints: [
            "Declara: <code>ConcurrentHashMap&lt;String, Set&lt;String&gt;&gt; groups = new ConcurrentHashMap&lt;&gt;();</code>",
            "Para addUserToGroup: <code>groups.computeIfAbsent(group, k -> ConcurrentHashMap.newKeySet()).add(user)</code>",
            "Para removeUserFromGroup, primero obtén el set con get(), luego remove() del set",
            "Para deleteGroup: <code>return groups.remove(group) != null;</code>"
        ],
        solution: `import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

class GroupsManager {
    // ConcurrentHashMap donde:
    // - Key: nombre del grupo
    // - Value: Set thread-safe de usuarios
    private ConcurrentHashMap<String, Set<String>> groups = new ConcurrentHashMap<>();

    public boolean addUserToGroup(String user, String group) {
        // computeIfAbsent es ATÓMICO:
        // - Si el grupo NO existe: ejecuta la función y guarda el resultado
        // - Si el grupo SÍ existe: retorna el valor existente
        // ConcurrentHashMap.newKeySet() crea un Set thread-safe
        Set<String> usuarios = groups.computeIfAbsent(group, 
            k -> ConcurrentHashMap.newKeySet());
        
        // add() retorna true si el elemento NO estaba en el set
        // retorna false si ya estaba (duplicado)
        return usuarios.add(user);
    }

    public boolean removeUserFromGroup(String user, String group) {
        // Obtenemos el set de usuarios del grupo
        Set<String> usuarios = groups.get(group);
        
        // Si el grupo no existe, retornamos false
        if (usuarios == null) {
            return false;
        }
        
        // remove() retorna true si el elemento estaba y fue eliminado
        boolean removed = usuarios.remove(user);
        
        // Si el grupo queda vacío, lo eliminamos
        // Nota: esto no es 100% atómico, pero es aceptable para este caso
        if (usuarios.isEmpty()) {
            groups.remove(group);
        }
        
        return removed;
    }

    public boolean deleteGroup(String group) {
        // remove() retorna el valor eliminado, o null si no existía
        return groups.remove(group) != null;
    }

    public void printGroups() {
        groups.forEach((g, users) -> 
            System.out.println(g + ": " + users));
    }
}

public class Main {
    public static void main(String[] args) {
        GroupsManager manager = new GroupsManager();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // Operaciones concurrentes sobre los grupos
            executor.submit(() -> manager.addUserToGroup("Ana", "grupo1"));
            executor.submit(() -> manager.addUserToGroup("Bob", "grupo1"));
            executor.submit(() -> manager.addUserToGroup("Ana", "grupo2"));
            executor.submit(() -> manager.addUserToGroup("Carlos", "grupo2"));
        }

        System.out.println("Grupos creados:");
        manager.printGroups();
        // Output esperado:
        // grupo1: [Ana, Bob]
        // grupo2: [Ana, Carlos]
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>🗺️ computeIfAbsent</h3>
                <pre><code>// Si no existe: calcula y guarda
// Si existe: retorna valor actual
V value = map.computeIfAbsent(
    key, 
    k -> crearValor()
);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>🗺️ Set thread-safe</h3>
                <pre><code>// Crear Set concurrente
Set&lt;String&gt; set = 
    ConcurrentHashMap.newKeySet();

// Ejemplo con grupos
Map&lt;String, Set&lt;String&gt;&gt; groups;
groups.computeIfAbsent(group, 
    k -> ConcurrentHashMap.newKeySet()
).add(user);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>🗺️ putIfAbsent</h3>
                <pre><code>// Pone solo si la clave no existe
// Retorna valor previo (null si no había)
V prev = map.putIfAbsent(key, value);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>🗺️ compute</h3>
                <pre><code>// Siempre ejecuta la función
// oldValue es null si no existía
map.compute(key, (k, oldValue) -> {
    return nuevoValor;
});</code></pre>
            </div>
        `,
        checkKeywords: ["ConcurrentHashMap", "computeIfAbsent", "newKeySet", "remove"]
    },

    // ===== EJERCICIO 10: CopyOnWriteArrayList =====
    {
        id: 10,
        title: "Ejercicio 10: Lista de Mensajes con CopyOnWriteArrayList",
        category: "Concurrent Collections",
        categoryClass: "concurrent",
        points: "5 puntos",
        description: `
            <p><strong>Sistema de mensajería:</strong></p>
            <ul>
                <li>Múltiples hilos añaden mensajes a una lista compartida</li>
                <li>Un hilo de servicio elimina mensajes antiguos (>2 segundos)</li>
                <li>Usa <code>CopyOnWriteArrayList</code> para evitar ConcurrentModificationException</li>
            </ul>
            <p>Implementa el record Mensaje y la lógica de limpieza.</p>
        `,
        initialCode: `import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

// TODO: Crear record Mensaje con text y date
// Añadir constructor secundario que solo reciba text


class MessageService {
    // TODO: Crear CopyOnWriteArrayList de Mensaje
    
    
    public void addMessage(String text) {
        // TODO: Añadir mensaje a la lista
        
    }

    public void removeOldMessages(int maxAgeSeconds) {
        // TODO: Eliminar mensajes más antiguos que maxAgeSeconds
        // Usa removeIf() o itera y elimina
        
    }

    public int getMessageCount() {
        // TODO: Retornar número de mensajes
        return 0;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        MessageService service = new MessageService();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // Hilos que envían mensajes
            for (int i = 0; i < 5; i++) {
                final int userId = i;
                executor.submit(() -> {
                    for (int j = 0; j < 3; j++) {
                        service.addMessage("Msg de user " + userId);
                        try { Thread.sleep(500); } catch (Exception e) {}
                    }
                });
            }

            // Hilo de limpieza
            executor.submit(() -> {
                for (int i = 0; i < 10; i++) {
                    try { Thread.sleep(1000); } catch (Exception e) {}
                    service.removeOldMessages(2);
                    System.out.println("Mensajes activos: " + service.getMessageCount());
                }
            });
        }
    }
}`,
        hints: [
            "Record con dos constructores: <code>record Mensaje(String text, LocalDateTime date) { Mensaje(String text) { this(text, LocalDateTime.now()); } }</code>",
            "Crea: <code>CopyOnWriteArrayList&lt;Mensaje&gt; messages = new CopyOnWriteArrayList&lt;&gt;();</code>",
            "Para removeOldMessages: <code>messages.removeIf(m -> ChronoUnit.SECONDS.between(m.date(), LocalDateTime.now()) > maxAgeSeconds);</code>",
            "CopyOnWriteArrayList permite iterar y eliminar sin ConcurrentModificationException"
        ],
        solution: `import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

// Record con constructor primario y secundario
record Mensaje(String text, LocalDateTime date) {
    // Constructor secundario que auto-genera la fecha
    public Mensaje(String text) {
        this(text, LocalDateTime.now());
    }
}

class MessageService {
    // CopyOnWriteArrayList: cada escritura crea una COPIA del array
    // Ventaja: las lecturas/iteraciones son muy rápidas y thread-safe
    // Desventaja: las escrituras son costosas (copian todo el array)
    // Ideal cuando hay MUCHAS lecturas y POCAS escrituras
    private CopyOnWriteArrayList<Mensaje> messages = new CopyOnWriteArrayList<>();
    
    public void addMessage(String text) {
        // add() es thread-safe, crea una nueva copia del array
        messages.add(new Mensaje(text));
    }

    public void removeOldMessages(int maxAgeSeconds) {
        // removeIf() es thread-safe en CopyOnWriteArrayList
        // No lanza ConcurrentModificationException
        messages.removeIf(mensaje -> {
            // Calculamos la edad del mensaje en segundos
            long edadSegundos = ChronoUnit.SECONDS.between(
                mensaje.date(), 
                LocalDateTime.now()
            );
            // Retornamos true si es viejo (para que se elimine)
            return edadSegundos > maxAgeSeconds;
        });
        
        // Alternativa manual (también válida):
        // for (Mensaje m : messages) {  // No lanza ConcurrentModificationException
        //     if (esAntiguo(m)) messages.remove(m);
        // }
    }

    public int getMessageCount() {
        return messages.size();
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        MessageService service = new MessageService();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            // 5 usuarios enviando mensajes cada 500ms
            for (int i = 0; i < 5; i++) {
                final int userId = i;
                executor.submit(() -> {
                    for (int j = 0; j < 3; j++) {
                        service.addMessage("Msg de user " + userId);
                        try { Thread.sleep(500); } catch (Exception e) {}
                    }
                });
            }

            // Hilo de limpieza: cada segundo elimina mensajes > 2 segundos
            executor.submit(() -> {
                for (int i = 0; i < 10; i++) {
                    try { Thread.sleep(1000); } catch (Exception e) {}
                    service.removeOldMessages(2);
                    System.out.println("Mensajes activos: " + service.getMessageCount());
                }
            });
        }
        
        // Los mensajes se mantienen alrededor de 5-10 (entran y salen)
    }
}`,
        syntaxReminders: `
            <div class="syntax-section">
                <h3>📋 CopyOnWriteArrayList</h3>
                <pre><code>CopyOnWriteArrayList&lt;T&gt; list = 
    new CopyOnWriteArrayList&lt;&gt;();</code></pre>
                <div class="syntax-note">
                    ✅ Ideal: muchas lecturas, pocas escrituras<br>
                    ❌ Evitar: muchas escrituras frecuentes
                </div>
            </div>
            <div class="syntax-section">
                <h3>📋 Métodos seguros</h3>
                <div class="syntax-method">
                    <span class="method-name">add(E e)</span>
                    <div class="method-desc">Añade elemento (copia array)</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">remove(Object o)</span>
                    <div class="method-desc">Elimina elemento</div>
                </div>
                <div class="syntax-method">
                    <span class="method-name">removeIf(Predicate)</span>
                    <div class="method-desc">Elimina si cumple condición</div>
                </div>
            </div>
            <div class="syntax-section">
                <h3>⏱️ ChronoUnit para tiempo</h3>
                <pre><code>long segundos = ChronoUnit.SECONDS
    .between(fecha1, fecha2);</code></pre>
            </div>
            <div class="syntax-section">
                <h3>📋 Record con 2 constructores</h3>
                <pre><code>record Mensaje(String text, LocalDateTime date) {
    public Mensaje(String text) {
        this(text, LocalDateTime.now());
    }
}</code></pre>
            </div>
        `,
        checkKeywords: ["CopyOnWriteArrayList", "Mensaje", "removeIf", "ChronoUnit"]
    }
];

// Exportar para uso en app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = exercises;
}
