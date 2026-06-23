# SuperiorStrength Tracker 🚀

SuperiorStrength es una aplicación web de alto rendimiento diseñada para atletas que buscan precisión en el seguimiento de sus entrenamientos. Construida con una arquitectura de "Anti-Slop", la app prioriza la claridad visual, la velocidad de interacción y la integridad de los datos.

## 📋 Visión del Proyecto

La aplicación sirve como un diario de entrenamiento integral que permite desglosar el volumen de trabajo por grupos musculares específicos y días de la semana. Calcula automáticamente el volumen total y una estimación de calorías quemadas basada en la intensidad del ejercicio.

### Lógica de Funcionamiento
- **Estado Global:** Utiliza `useReducer` para manejar un CRUD complejo de sesiones de entrenamiento, garantizando que el flujo de datos sea predecible e inmutable.
- **Persistencia:** Sincronización automática con `localStorage` para que el progreso nunca se pierda entre recargas de página.
- **i18n:** Soporte nativo para Inglés y Español mediante un sistema de traducción escalable.
- **UX Premium:** Animaciones con `framer-motion`, componentes de UI basados en ShadCN y diálogos de confirmación avanzados para una experiencia táctil y visual superior.

## 🛠 Instalación y Desarrollo

La aplicación es compatible con los gestores de paquetes más modernos:

```bash
# Con npm
npm install
npm run dev

# Con yarn
yarn install
yarn dev

# Con pnpm
pnpm install
pnpm dev
```

Para subir a producción:
```bash
npm run build
npm run start
```

## 🏗 Arquitectura Técnica
- **Framework:** Next.js 15 (App Router).
- **Estilos:** Tailwind CSS con variables HSL personalizadas y control estricto de desbordamiento (Anti-Slop).
- **Componentes:** Radix UI + ShadCN (Dialogs, Tabs, AlertDialog).
- **Animaciones:** Framer Motion para transiciones de estado y efectos de cascada.

## 🚀 Futuro Escalable (Roadmap)
1. **Sincronización Cloud:** Integración con Firebase Auth y Firestore para permitir el acceso multi-dispositivo y guardado en la nube.
2. **Mapa de Calor Muscular:** Visualización SVG interactiva que resalte los músculos trabajados según el volumen semanal.
3. **Análisis de Progresión:** Gráficas de rendimiento histórico para visualizar el aumento de fuerza en el tiempo (PRs).
4. **Modo Offline PWA:** Soporte completo para Service Workers para uso en gimnasios con mala conexión.

---
Desarrollado con enfoque en **Diseño Profesional y Cero Desbordamiento (Anti-Slop)**.