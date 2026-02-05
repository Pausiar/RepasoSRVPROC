# 🎯 Práctica Examen - Concurrencia Java

Web interactiva de ejercicios prácticos para preparar el examen de **Servicios y Procesos**.

## 📅 Examen: 6/02 (8h - 10h)

### Contenido evaluable:
- **Lock/Synchronized** (2.5 puntos)
- **Atomic Variables** (2.5 puntos)  
- **Concurrent Collections** (5 puntos)

## 🚀 Cómo usar

### Opción 1: Abrir directamente
Simplemente abre el archivo `index.html` en tu navegador.

### Opción 2: Desplegar en GitHub Pages
1. Sube esta carpeta a un repositorio de GitHub
2. Ve a **Settings** → **Pages**
3. En "Source" selecciona la rama `main` y la carpeta donde está la web
4. ¡Listo! Tu web estará en `https://tuusuario.github.io/tunombredepo/`

## 📚 Ejercicios incluidos

| # | Tema | Descripción |
|---|------|-------------|
| 1 | General | Crear y lanzar hilos simultáneamente |
| 2 | Synchronized | Contador con synchronized methods |
| 3 | AtomicInteger | Contador con operaciones atómicas |
| 4 | AtomicInteger | Control de acceso con compareAndSet |
| 5 | AtomicReference | Perfil de usuario con referencias atómicas |
| 6 | Lock | Estructura básica de ReentrantLock |
| 7 | Lock | tryLock() para evitar deadlocks |
| 8 | ConcurrentHashMap | Histograma con merge() |
| 9 | ConcurrentHashMap | Grupos de chat con computeIfAbsent |
| 10 | CopyOnWriteArrayList | Sistema de mensajería |

## ✨ Características

- ✅ **10 ejercicios prácticos** adaptados al temario
- 📋 **Panel de sintaxis** con recordatorios clave
- 💡 **Botón de pistas** para ayudarte
- ✅ **Verificación automática** del código
- 📖 **Soluciones comentadas** línea por línea
- 🎨 **Editor de código** con sintaxis resaltada

## 🔑 Sintaxis clave a recordar

### Synchronized
```java
public synchronized void metodo() { }
synchronized(objeto) { }
```

### Lock
```java
Lock lock = new ReentrantLock();
lock.lock();
try { } finally { lock.unlock(); }
```

### AtomicInteger
```java
AtomicInteger ai = new AtomicInteger(0);
ai.incrementAndGet();
ai.compareAndSet(expected, newValue);
ai.updateAndGet(current -> current + 1);
```

### AtomicReference
```java
AtomicReference<T> ref = new AtomicReference<>(valor);
ref.get();
ref.set(nuevoValor);
ref.compareAndSet(expected, newValue);
```

### ConcurrentHashMap
```java
ConcurrentHashMap<K,V> map = new ConcurrentHashMap<>();
map.merge(key, 1, Integer::sum);
map.computeIfAbsent(key, k -> crearValor());
map.putIfAbsent(key, value);
```

### CopyOnWriteArrayList
```java
CopyOnWriteArrayList<T> list = new CopyOnWriteArrayList<>();
list.removeIf(e -> condicion);
```

## 📝 Consejos para el examen

1. **Synchronized vs Lock**: Lock es más flexible (tryLock, fairness)
2. **AtomicInteger**: Más eficiente que synchronized para operaciones simples
3. **compareAndSet**: Patrón CAS en bucle para operaciones condicionales
4. **merge()**: Clave para contadores en ConcurrentHashMap
5. **computeIfAbsent**: Para crear valores solo si no existen
6. **CopyOnWriteArrayList**: Ideal para muchas lecturas, pocas escrituras

¡Mucha suerte en el examen! 💪
