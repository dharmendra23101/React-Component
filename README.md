# React Component Library
A modern UI component library built with React, TypeScript, and Framer Motion.

Last updated: 2025-08-17 14:16:06 by dharmendra23101

## Features
- Advanced InputField component with various states and variants
- DataTable with sorting, filtering, and pagination
- Button component with animations and multiple styles
- Modal component with custom animations
- Dark mode support
- Responsive design
- TypeScript type safety
- Framer Motion animations

## Components

### InputField
A versatile input component with:
- Multiple variants: outlined, filled, ghost, floating
- Various sizes: small, medium, large
- States: default, disabled, invalid, loading
- Optional features: clear button, password toggle, character count
- Icon support (left and right)

### DataTable
A feature-rich table component with:
- Sorting functionality
- Filtering and searching
- Pagination
- Row selection (single/multiple)
- Responsive design (mobile optimized)
- Loading and empty states
- Export functionality
- Customizable columns

### Button
A customizable button component with:
- Multiple variants: primary, secondary, outline, ghost, link, success, danger, warning
- Various sizes: xs, sm, md, lg, xl
- States: loading, disabled, active
- Icon support (left and right)
- Customizable elevation and rounded corners
- Micro-animations with Framer Motion

### Modal
A flexible modal dialog with:
- Multiple sizes
- Various animation presets
- Custom footer options
- Scrollable content
- Backdrop click handling
- ESC key support
- Focus management

## Installation

```bash
npm install @dharmendra23101/react-components
```

## Usage

```jsx
import { Button, InputField, DataTable, Modal } from '@dharmendra23101/react-components';

function App() {
  return (
    <div>
      <h1>My Application</h1>
      
      <InputField 
        label="Email" 
        placeholder="Enter your email" 
        variant="outlined" 
      />
      
      <Button variant="primary">
        Submit
      </Button>
    </div>
  );
}
```

## Theme Support

The library supports both light and dark modes through the ThemeProvider:

```jsx
import { ThemeProvider } from '@dharmendra23101/react-components';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Live Demo

Check out the [interactive demo](https://dharmendra23101.github.io/React-Component) to see all components in action.

## Component API

### InputField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | undefined | Input label text |
| placeholder | string | undefined | Input placeholder text |
| value | string | '' | Controlled input value |
| defaultValue | string | undefined | Uncontrolled default value |
| onChange | function | undefined | Change event handler |
| type | string | 'text' | Input type (text, password, email, etc.) |
| variant | string | 'outlined' | 'outlined', 'filled', 'ghost', 'floating' |
| size | string | 'md' | 'sm', 'md', 'lg' |
| disabled | boolean | false | Disables the input |
| invalid | boolean | false | Shows error state |
| loading | boolean | false | Shows loading indicator |
| errorMessage | string | undefined | Error message to display |
| showPasswordToggle | boolean | false | Shows password visibility toggle |
| showClearButton | boolean | false | Shows clear input button |
| maxLength | number | undefined | Maximum character limit |
| showCharacterCount | boolean | false | Shows character count |

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'primary' | 'primary', 'secondary', 'outline', 'ghost', 'link', 'success', 'danger', 'warning' |
| size | string | 'md' | 'xs', 'sm', 'md', 'lg', 'xl' |
| isLoading | boolean | false | Shows loading spinner |
| leftIcon | ReactNode | undefined | Icon before button text |
| rightIcon | ReactNode | undefined | Icon after button text |
| fullWidth | boolean | false | Makes button take full width |
| isActive | boolean | false | Shows active state |
| elevation | string | 'sm' | 'none', 'sm', 'md', 'lg' |
| rounded | string | 'md' | 'none', 'sm', 'md', 'lg', 'full' |
| animateOnHover | boolean | true | Enables hover animations |

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | array | required | Array of data objects |
| columns | array | required | Column definitions |
| loading | boolean | false | Shows loading state |
| selectable | boolean | false | Enables row selection |
| pagination | boolean | false | Enables pagination |
| pageSize | number | 10 | Items per page |
| filters | array | [] | Filter configurations |
| searchable | boolean | false | Enables search functionality |
| exportable | boolean | false | Enables export functionality |
| stickyHeader | boolean | false | Makes header stick to top |
| rowHover | boolean | true | Enables row hover effects |
| striped | boolean | true | Applies striped row styling |

### Modal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | required | Controls modal visibility |
| onClose | function | required | Called when modal closes |
| title | string | undefined | Modal title |
| children | ReactNode | required | Modal content |
| footer | ReactNode | undefined | Modal footer content |
| size | string | 'md' | 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full' |
| closeOnOverlayClick | boolean | true | Close when clicking overlay |
| closeOnEsc | boolean | true | Close when pressing ESC key |
| showCloseButton | boolean | true | Shows close button in header |
| animationPreset | string | 'scale' | 'fade', 'slide', 'scale', 'flip' |

## Development

### Prerequisites
- Node.js 14+
- npm or yarn

### Getting Started
```bash
# Clone the repository
git clone https://github.com/dharmendra23101/React-Component.git

# Install dependencies
cd React-Component
npm install

# Start the development server
npm start
```

### Building
```bash
npm run build
```

## Testing
```bash
npm test
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Accessibility
All components are built with accessibility in mind and follow WAI-ARIA standards.

## Performance Optimizations
- Code splitting
- Tree shaking support
- Memoized components
- Virtualized lists for large datasets

## License
MIT

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author
- dharmendra23101

## Acknowledgments
- React team for the amazing library
- Framer Motion for the animation capabilities
- TailwindCSS team for the styling inspiration
