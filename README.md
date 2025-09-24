# Ecommerce con DummyJSON

Un ecommerce moderno construido con Next.js 15, TypeScript y Shadcn/ui que consume la API de DummyJSON para mostrar productos.

## 🚀 Características

### Funcionalidades principales

- **Grid de productos** con paginación y filtros
- **Búsqueda en tiempo real** con debounce (300-500ms)
- **Filtros por categoría** y ordenamiento (precio/rating asc/desc)
- **Rutas dinámicas** para productos individuales (`/product/[id]`)
- **Metadata dinámico** para SEO en cada producto
- **Gráficas interactivas** de precio histórico con recharts
- **Skeletons de carga** para mejor UX
- **Formateo de precios** en pesos mexicanos (MXN)
- **Formateo de fechas** con `date-fns`
- **Diseño responsive** con breakpoints documentados
- **Accesibilidad completa** (ARIA, navegación por teclado)

### Arquitectura técnica

- **Server Components** para la primera carga
- **API Route proxy** que extiende DummyJSON con transformaciones
- **Context API** para manejo de estado de filtros
- **Custom hooks** reutilizables:
  - `useDebouncedSearch` - Búsqueda con debounce y cancelación
  - `useProducts` - Fetch de productos con cache y manejo de errores
- **AbortController** para cancelación de peticiones
- **Cache en memoria** para optimización
- **Manejo de errores** con reintentos exponenciales

## 🛠️ Tecnologías

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Shadcn/ui** - Componentes UI modernos
- **Tailwind CSS** - Estilos utilitarios
- **date-fns** - Manipulación de fechas
- **recharts** - Gráficas interactivas
- **Lucide React** - Iconos

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🏗️ Estructura del proyecto

```
src/
├── app/
│   ├── api/dummy/products/route.ts    # API proxy para DummyJSON
│   ├── product/[id]/
│   │   ├── page.tsx                   # Página de producto individual
│   │   └── not-found.tsx              # Página 404 para productos
│   ├── layout.tsx                     # Layout principal
│   └── page.tsx                       # Página principal
├── components/
│   ├── ui/                            # Componentes Shadcn
│   ├── ProductCard.tsx                # Tarjeta de producto
│   ├── ProductDetail.tsx              # Detalle de producto
│   ├── SearchFilters.tsx              # Filtros de búsqueda
│   ├── Pagination.tsx                 # Componente de paginación
│   ├── ProductSkeleton.tsx            # Skeletons de carga
│   └── ProductsPage.tsx               # Página principal
├── contexts/
│   └── SearchFiltersContext.tsx       # Context para filtros
├── hooks/
│   ├── useDebouncedSearch.ts          # Hook de búsqueda con debounce
│   └── useProducts.ts                 # Hook para fetch de productos
├── types/
│   └── product.ts                     # Tipos TypeScript
└── lib/
    └── utils.ts                       # Utilidades
```

## 🔧 API Proxy

El endpoint `/api/dummy/products` actúa como proxy de DummyJSON con las siguientes mejoras:

### Parámetros soportados

- `q` - Búsqueda por texto
- `category` - Filtro por categoría
- `sort` - Ordenamiento (price, rating, title)
- `order` - Orden (asc, desc)
- `page` - Página actual
- `limit` - Elementos por página
- `delay` - Simular latencia (1000-5000ms)
- `retries` - Número de reintentos

### Transformaciones añadidas

- `localPrice` - Precio formateado en EUR
- `stockStatus` - Estado del stock (in_stock, low_stock, out_of_stock)
- `fetchedAt` - Timestamp de cuando se obtuvo el dato

### Características

- **Cache** con TTL de 5 minutos
- **ETag** para validación de cache
- **Reintentos exponenciales** (1s, 2s, 4s)
- **Manejo de errores** robusto
- **Headers de cache** apropiados

## 🎨 Componentes UI

### ProductCard

- Imagen con hover effects
- Badges de descuento y stock
- Rating con estrellas
- Precio formateado
- Botones de acción

### SearchFilters

- Búsqueda con debounce visual
- Filtros por categoría
- Ordenamiento y orden
- Filtros activos con badges
- Botón de reset

### Pagination

- Navegación con números de página
- Botones de primera/última página
- Selector de elementos por página
- Información de resultados

## 🔍 Custom Hooks

### useDebouncedSearch

```typescript
const { debouncedValue, isDebouncing, cancel } = useDebouncedSearch(
  searchValue,
  { delay: 400, minLength: 0 }
);
```

### useProducts

```typescript
const {
  products,
  total,
  loading,
  error,
  refetch,
  hasNextPage,
  hasPreviousPage,
  currentPage,
  totalPages,
} = useProducts({
  q: "search term",
  category: "smartphones",
  sort: "price",
  order: "asc",
  page: 1,
  limit: 12,
});
```

## 📱 Responsive Design

### Breakpoints Tailwind CSS

El proyecto utiliza un enfoque **mobile-first** con los siguientes breakpoints:

- **`sm`** (640px+) - Tablets pequeñas
- **`md`** (768px+) - Tablets
- **`lg`** (1024px+) - Laptops
- **`xl`** (1280px+) - Desktop
- **`2xl`** (1536px+) - Pantallas grandes

### Clases Responsivas Utilizadas

#### Grid de Productos

```css
/* Mobile: 1 columna */
grid-cols-1

/* Tablet: 2 columnas */
sm:grid-cols-2

/* Laptop: 3 columnas */
lg:grid-cols-3

/* Desktop: 4 columnas */
xl:grid-cols-4
```

#### Filtros de Búsqueda

```css
/* Mobile: 1 columna */
grid-cols-1

/* Tablet: 2 columnas */
sm:grid-cols-2

/* Desktop: 3 columnas */
lg:grid-cols-3
```

#### Layout de Producto Individual

```css
/* Mobile: 1 columna */
grid-cols-1

/* Desktop: 2 columnas */
xl:grid-cols-2
```

#### Tipografía Responsiva

```css
/* Mobile: texto pequeño */
text-xl

/* Desktop: texto grande */
sm:text-2xl
```

#### Navegación

```css
/* Mobile: columna */
flex-col

/* Desktop: fila */
sm:flex-row
```

### Características Responsivas

- **Grid adaptativo** - 1-4 columnas según el tamaño de pantalla
- **Filtros adaptativos** - Layout que se ajusta al espacio disponible
- **Paginación responsive** - Botones que se ocultan en móviles
- **Imágenes optimizadas** - Diferentes tamaños según el dispositivo
- **Tipografía escalable** - Tamaños que se adaptan al viewport

## ♿ Accesibilidad

### Características Implementadas

- **ARIA Labels** - Etiquetas descriptivas para todos los controles
- **Navegación por teclado** - Todos los elementos son navegables con Tab
- **Contraste adecuado** - Colores que cumplen estándares WCAG
- **Foco visible** - Indicadores claros de elementos activos
- **Lectores de pantalla** - Contenido alternativo para gráficas
- **Semántica HTML** - Uso correcto de elementos semánticos

### Implementaciones Específicas

#### Gráficas Accesibles

```typescript
// Descripción para lectores de pantalla
aria-label={`Gráfica de historial de precios para ${productName}`}

// Contenido alternativo oculto
<div className="sr-only">
  <p>Gráfica de historial de precios para {productName}...</p>
</div>
```

#### Paginación Accesible

```typescript
// Página actual marcada
aria-current={page === currentPage ? 'page' : undefined}

// Etiquetas descriptivas
aria-label={`Ir a la página ${page}`}
```

#### Formularios Accesibles

```typescript
// Inputs con etiquetas
<Input aria-label="Buscar productos" aria-describedby="search-help" />
```

### Estándares Cumplidos

- **WCAG 2.1 AA** - Nivel de conformidad recomendado
- **Section 508** - Estándares de accesibilidad gubernamental
- **WAI-ARIA** - Especificaciones para contenido dinámico

## 📊 Gráficas Interactivas

### Características de las Gráficas

- **Precio histórico simulado** - Datos de 12 meses con variaciones realistas
- **Responsive** - Se adapta a diferentes tamaños de pantalla
- **Accesible** - Descripciones para lectores de pantalla
- **Interactiva** - Tooltips con información detallada
- **Tendencias visuales** - Indicadores de subida/bajada de precios

### Implementación con Recharts

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

// Gráfica responsive y accesible
<ResponsiveContainer width="100%" height="100%">
  <LineChart
    data={priceData}
    role="img"
    aria-label={`Gráfica de historial de precios para ${productName}`}
  >
    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>;
```

### Datos Simulados

- **Variación realista** - ±15% de variación en precios
- **Estacionalidad** - Patrones que simulan el mercado real
- **Límites seguros** - Precios nunca inferiores al 70% del precio base
- **Formateo local** - Precios en pesos mexicanos (MXN)

## 🚀 Optimizaciones

- **Server Components** para SEO y rendimiento
- **Image optimization** con Next.js Image
- **Lazy loading** de imágenes
- **Cache estratégico** en múltiples niveles
- **Debounce** para reducir peticiones
- **AbortController** para cancelar peticiones obsoletas

## 🧪 Testing

Para probar la funcionalidad de delay y reintentos:

```bash
# Simular latencia de 2 segundos
curl "http://localhost:3000/api/dummy/products?delay=2000"

# Simular reintentos (fallará después de 2 intentos)
curl "http://localhost:3000/api/dummy/products?retries=2"
```

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
