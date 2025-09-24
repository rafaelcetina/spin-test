# Ecommerce con DummyJSON

Un ecommerce moderno construido con Next.js 15, TypeScript y Shadcn/ui que consume la API de DummyJSON para mostrar productos.

## 🚀 Características

### Funcionalidades principales

- **Grid de productos** con paginación y filtros
- **Búsqueda en tiempo real** con debounce (300-500ms)
- **Filtros por categoría** y ordenamiento (precio/rating asc/desc)
- **Rutas dinámicas** para productos individuales (`/product/[id]`)
- **Metadata dinámico** para SEO en cada producto
- **Skeletons de carga** para mejor UX
- **Formateo de precios** con `Intl.NumberFormat`
- **Formateo de fechas** con `date-fns`

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

- **Mobile First** - Diseño optimizado para móviles
- **Grid adaptativo** - 1-4 columnas según el tamaño de pantalla
- **Filtros colapsables** - Mejor UX en móviles
- **Paginación responsive** - Botones adaptativos

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
