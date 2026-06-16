# Contributing to Bootstrap Plus

We welcome contributions to make Bootstrap Plus an even better resource for developers! Whether it's adding a new component, fixing a bug, or improving existing styles, your help is appreciated.

## How to Add a New Component

1. **Fork the Repository**: Create your own fork and branch off `main`.
2. **Update `index.html`**:
   - Add your new component within a new `<section class="scroll-section" id="your-component-section">`.
   - Follow the existing HTML pattern for `.component-card`, `.preview-container`, and `.code-container`.
   - Ensure your HTML snippet is properly escaped inside the `<pre class="code-pre"><code>` block. Our built-in JavaScript will handle the syntax highlighting automatically.
3. **Update Sidebar**: Add a navigation link to your new section in the `<aside class="sidebar" id="sidebar">` so users can easily find it.
4. **Update `style.css` (if necessary)**: Add any custom CSS required for your component. Ensure it supports both `[data-bs-theme="light"]` and `[data-bs-theme="dark"]` to maintain dark mode compatibility.
5. **Update `script.js` (if necessary)**: Add any JavaScript functionality. Keep it modular and well-commented.
6. **Submit a Pull Request**: Provide a clear description of the component you added and include screenshots of the preview if possible.

## Coding Guidelines

- **Use Bootstrap Utilities First**: Rely on Bootstrap's built-in utility classes (margin, padding, colors) as much as possible before writing custom CSS.
- **Responsive First**: Ensure all components look great on mobile, tablet, and desktop devices by utilizing Bootstrap's grid and responsive display classes.
- **Clean Code**: Keep HTML formatting clean. For the code preview blocks (`<pre><code>`), ensure the snippet is exactly what users need to copy.
- **Accessibility**: Use appropriate ARIA labels and semantic HTML tags.
