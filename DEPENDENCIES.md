# Dependencias Añadidas

## date-fns

**Versión:** 3.6.0

**Motivo de instalación:**
Se instaló `date-fns` para el formateo de fechas en lugar de usar `Intl.DateTimeFormat` por las siguientes razones:

1. **Localización mejorada**: `date-fns` proporciona mejor soporte para localización con el paquete `date-fns/locale`
2. **API más intuitiva**: Sintaxis más clara y fácil de usar que `Intl.DateTimeFormat`
3. **Consistencia**: Formateo uniforme de fechas en toda la aplicación
4. **Funcionalidades adicionales**: Mejor manejo de casos edge y validación de fechas
5. **Tree-shaking**: Solo se importan las funciones necesarias, reduciendo el bundle size

**Uso en el proyecto:**

```typescript
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Formateo de fechas en español
const formattedDate = format(new Date(dateString), "dd MMMM yyyy", {
  locale: es,
});
```

**Alternativas consideradas:**

- `Intl.DateTimeFormat`: Más nativo pero menos flexible para localización
- `moment.js`: Más pesado y en modo legacy
- `dayjs`: Alternativa ligera pero `date-fns` tiene mejor soporte para TypeScript

## Componentes Shadcn/ui

**Componentes instalados:**

- `button` - Botones con variantes
- `input` - Campos de entrada
- `select` - Selectores desplegables
- `card` - Tarjetas de contenido
- `skeleton` - Placeholders de carga
- `badge` - Etiquetas y badges
- `alert` - Alertas y notificaciones
- `separator` - Separadores visuales

**Motivo de uso:**

- **Diseño consistente**: Sistema de diseño unificado
- **Accesibilidad**: Componentes accesibles por defecto
- **Customización**: Fácil personalización con CSS variables
- **TypeScript**: Tipado completo
- **Performance**: Componentes optimizados
- **Tema**: Soporte para modo oscuro/claro

## Dependencias del proyecto base

El proyecto ya incluía las siguientes dependencias esenciales:

- `next` 15.5.4 - Framework React
- `react` 19.1.0 - Biblioteca de UI
- `typescript` 5 - Tipado estático
- `tailwindcss` 4 - Framework CSS
- `lucide-react` - Iconos
- `class-variance-authority` - Manejo de variantes de clases
- `clsx` y `tailwind-merge` - Utilidades para clases CSS

## recharts

**Versión:** 2.12.7

**Motivo de instalación:**
Se instaló `recharts` para implementar gráficas interactivas de precio histórico en la página de detalle de productos por las siguientes razones:

1. **Gráficas interactivas**: Proporciona componentes de gráficas modernos y responsivos
2. **Accesibilidad**: Soporte nativo para ARIA labels y lectores de pantalla
3. **Responsive**: Se adapta automáticamente a diferentes tamaños de pantalla
4. **Ligero**: Biblioteca optimizada que no añade mucho peso al bundle
5. **TypeScript**: Tipado completo para mejor experiencia de desarrollo
6. **Customizable**: Fácil personalización de colores, estilos y comportamiento

**Uso en el proyecto:**

```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Gráfica de precio histórico con datos simulados
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={priceData} role="img" aria-label="Gráfica de precios">
    <Line type="monotone" dataKey="price" stroke="#3b82f6" />
  </LineChart>
</ResponsiveContainer>;
```

**Alternativas consideradas:**

- `Chart.js`: Más pesado y requiere configuración adicional
- `D3.js`: Muy potente pero complejo para casos simples
- `Victory`: Buena opción pero menos popular
- `SVG manual`: Más control pero requiere más código
