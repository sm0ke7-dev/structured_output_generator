# Structured Output Generator

A TypeScript project for generating structured output with modern development practices.

## Features

- 🚀 TypeScript with strict type checking
- 📦 Modern ES2022 features
- 🧪 Jest testing framework
- 📝 ESLint for code quality
- 🔧 Hot reloading with `tsc --watch`
- 📚 Source maps and declaration files
- 🤖 OpenAI API integration with structured output
- 📋 Customizable prompt templates
- ✅ Response validation and error handling

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd structured-output-generator
```

2. Install dependencies:
```bash
npm install
```

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development (auto-recompile on changes)
- `npm start` - Run the compiled application
- `npm run example` - Run OpenAI examples
- `npm test` - Run tests with Jest
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

### Project Structure

```
structured-output-generator/
├── src/                    # Source TypeScript files
│   └── index.ts           # Main entry point
├── dist/                   # Compiled JavaScript (generated)
├── tests/                  # Test files
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your OpenAI API key:
```bash
# Option 1: Environment variable
export OPENAI_API_KEY="your-api-key-here"

# Option 2: Pass directly to constructor
const generator = new OpenAIGenerator('your-api-key-here');
```

3. Start the development server:
```bash
npm run dev
```

4. In another terminal, run the application:
```bash
npm start
```

5. Run OpenAI examples:
```bash
npm run example
```

## Testing

Run the test suite:
```bash
npm test
```

## Code Quality

The project uses ESLint for code quality. Run linting:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

## Usage Examples

### Basic OpenAI Integration

```typescript
import { OpenAIGenerator } from './src/openai-generator';

const generator = new OpenAIGenerator();

const response = await generator.generateStructuredOutput({
  keyword: 'Are raccoons a danger to humans?',
  promptTemplate: 'Give me a list of subtopics related to the search keyphrase "{keyword}". For each subtopic, provide a heading and a brief description.'
});

console.log(response);
// Output:
// {
//   "response": [
//     {
//       "heading": "Disease Transmission",
//       "description": "Raccoons can carry diseases like rabies and roundworm..."
//     },
//     {
//       "heading": "Aggressive Behavior",
//       "description": "While generally not aggressive, raccoons may attack if cornered..."
//     }
//   ]
// }
```

### Custom Prompt Templates

```typescript
const generator = new OpenAIGenerator();

// Set a custom template
generator.setPromptTemplate('Analyze the topic "{keyword}" and break it down into key components. For each component, provide a title and explanation.');

const response = await generator.generateStructuredOutput({
  keyword: 'Sustainable energy solutions'
});
```

## Building for Production

Compile the TypeScript code:
```bash
npm run build
```

The compiled JavaScript will be available in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details. 