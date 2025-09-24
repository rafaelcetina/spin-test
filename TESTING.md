# Testing Documentation

Este proyecto implementa un sistema completo de testing con Jest y React Testing Library, cumpliendo con los requisitos mínimos de cobertura del 80%.

## Estructura de Testing

```
src/__tests__/
├── __mocks__/           # Mocks y datos de prueba
│   ├── mockData.ts      # Datos mock para productos y categorías
│   └── fetchMock.ts     # Mocks para fetch y respuestas de API
├── utils/               # Utilidades de testing
│   └── testUtils.tsx    # Helpers y render personalizado
├── components/          # Unit tests para componentes
│   ├── ProductCard.test.tsx
│   ├── SearchFilters.test.tsx
│   └── Pagination.test.tsx
├── hooks/               # Unit tests para hooks
│   ├── useDebouncedSearch.test.ts
│   └── useProducts.test.ts
├── integration/         # Integration tests
│   ├── searchFlow.test.tsx
│   ├── urlSync.test.tsx
│   └── productDetail.test.tsx
└── api/                 # API tests
    └── products.test.ts
```

## Configuración

### Dependencias de Testing

- **Jest**: Framework de testing principal
- **React Testing Library**: Testing de componentes React
- **@testing-library/jest-dom**: Matchers adicionales para DOM
- **@testing-library/user-event**: Simulación de eventos de usuario
- **jest-environment-jsdom**: Entorno de testing para DOM

### Scripts Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests para CI
npm run test:ci
```

## Cobertura de Tests

### Requisitos Mínimos

- **Cobertura Global**: 80% (branches, functions, lines, statements)
- **Componentes Críticos**: 85%
- **Hooks**: 90%
- **Contextos**: 85%

### Componentes Cubiertos

#### Unit Tests

- ✅ **ProductCard**: Renderizado, props, accesibilidad, casos edge
- ✅ **SearchFilters**: Filtros, debounce, estado, accesibilidad
- ✅ **Pagination**: Navegación, estados, accesibilidad
- ✅ **useDebouncedSearch**: Debounce, cancelación, timers
- ✅ **useProducts**: Fetch, cache, errores, paginación

#### Integration Tests

- ✅ **Flujo de Búsqueda**: Debounce + cancelación, filtros + URL
- ✅ **Sincronización URL**: Parámetros, navegación, estado
- ✅ **Detalle de Producto**: Metadata, gráficas, responsive
- ✅ **API Routes**: Proxy, transformaciones, errores, retry

## Mocks y Utilidades

### Mock Data

```typescript
// Datos de prueba consistentes
export const mockProduct: Product = { ... }
export const mockProducts: Product[] = [ ... ]
export const mockCategories: Category[] = [ ... ]
```

### Fetch Mocking

```typescript
// Simulación de respuestas de API
export const mockFetch = {
  productsSuccess: () => Promise.resolve({ ... }),
  error: () => Promise.resolve({ ... }),
  delayedSuccess: (delay) => new Promise(...)
}
```

### Test Utils

```typescript
// Render personalizado con providers
const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

// Helpers para testing
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))
export const mockSearchParams = (params) => { ... }
export const mockRouter = (overrides) => { ... }
```

## Flujos de Testing

### 1. Búsqueda con Debounce

```typescript
it("completes full search flow with debounce and cancellation", async () => {
  // Simula typing rápido
  await user.type(searchInput, "iPhone");

  // Verifica debounce
  expect(mockUseProducts).toHaveBeenCalledWith({
    q: "iPhone",
    // ... otros parámetros
  });
});
```

### 2. Filtros + Actualización URL

```typescript
it("updates URL when filters change", async () => {
  // Cambia filtros
  await user.click(categorySelect);
  await user.click(screen.getByText("Smartphones"));

  // Verifica URL update
  expect(mockPush).toHaveBeenCalledWith(
    expect.stringContaining("category=smartphones")
  );
});
```

### 3. Navegación + Metadata

```typescript
it("renders product information correctly", () => {
  render(<ProductDetail product={mockProduct} />);

  expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  expect(screen.getByText("$549.00 MXN")).toBeInTheDocument();
});
```

## CI/CD

### GitHub Actions

- ✅ Ejecuta tests en Node.js 18.x y 20.x
- ✅ Verifica linting con Biome
- ✅ Ejecuta tests con coverage
- ✅ Sube coverage a Codecov
- ✅ Comenta coverage en PRs

### Coverage Reports

- **HTML**: `coverage/index.html`
- **LCOV**: `coverage/lcov.info`
- **JSON**: `coverage/coverage-final.json`

## Mejores Prácticas

### 1. Testing de Componentes

- Usar `screen.getByRole()` para elementos accesibles
- Verificar props y estado
- Probar casos edge y errores
- Incluir tests de accesibilidad

### 2. Testing de Hooks

- Usar `renderHook()` para hooks aislados
- Probar estados de loading, error, success
- Verificar cleanup y efectos
- Mockear dependencias externas

### 3. Integration Testing

- Probar flujos completos de usuario
- Verificar interacciones entre componentes
- Mockear APIs y servicios
- Probar sincronización de estado

### 4. Mocking

- Usar mocks consistentes y reutilizables
- Mockear solo lo necesario
- Mantener mocks actualizados
- Documentar comportamiento de mocks

## Troubleshooting

### Problemas Comunes

1. **Tests fallan por timers**

   ```typescript
   jest.useFakeTimers();
   // ... test code
   jest.runOnlyPendingTimers();
   ```

2. **Mocks no funcionan**

   ```typescript
   jest.clearAllMocks();
   // Verificar que el mock esté en el lugar correcto
   ```

3. **Async tests fallan**
   ```typescript
   await waitFor(() => {
     expect(element).toBeInTheDocument();
   });
   ```

### Debugging

- Usar `screen.debug()` para ver el DOM
- Verificar que los mocks estén configurados correctamente
- Revisar la consola para errores de React
- Usar `--verbose` para más información

## Métricas de Calidad

- **Cobertura de Código**: 80%+ global, 85%+ componentes críticos
- **Tests por Componente**: Mínimo 5-10 tests por componente
- **Casos Edge**: Cubiertos para inputs inválidos, errores, estados vacíos
- **Accesibilidad**: Tests para ARIA, keyboard navigation, screen readers
- **Performance**: Tests para debounce, cancelación, cache

## Próximos Pasos

1. **E2E Testing**: Agregar Playwright o Cypress
2. **Visual Testing**: Implementar Chromatic o similar
3. **Performance Testing**: Tests de rendimiento con Lighthouse
4. **Accessibility Testing**: Tests automatizados de a11y
5. **Mutation Testing**: Verificar calidad de tests con Stryker
