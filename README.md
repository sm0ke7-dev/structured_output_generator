# Structured Output Generator

A TypeScript application that generates structured, consistent output from OpenAI's API. Perfect for content creators, researchers, and developers who need reliable, formatted responses for various use cases.

## 🎯 What This Project Does

This application takes a keyword or topic and generates structured content in a consistent JSON format. It's designed for:

- **Content Research**: Generate subtopics, analysis breakdowns, and step-by-step guides
- **SEO Content Planning**: Create structured outlines for articles and blog posts  
- **Educational Content**: Break down complex topics into digestible components
- **Data Analysis**: Get consistent, structured responses for processing

## ✨ Key Features

- 🤖 **OpenAI API Integration** - Leverages GPT models for intelligent content generation
- 📋 **Structured Output** - Always returns consistent JSON format with `heading` and `description` fields
- 🎛️ **Prompt Management System** - Organized prompt templates by category (subtopics, analysis, guidance, tutorials)
- 🔧 **Configurable Parameters** - Control model, temperature, tokens, and response format per prompt
- 🖥️ **Interactive CLI** - User-friendly command-line interface for easy testing
- 📁 **Repository Pattern** - Clean separation of prompt data and business logic
- ✅ **Type Safety** - Full TypeScript support with strict type checking
- 🧪 **Testing Suite** - Comprehensive testing with Jest

## 🏗️ Architecture

The project follows a layered architecture pattern:

```
src/
├── index.ts                    # Main entry point & interactive CLI
├── openai-generator.ts         # OpenAI API integration & response handling
├── repositories/
│   ├── pull_prompt.ts         # Prompt repository layer
│   └── data/                  # Prompt template files
│       ├── subtopics-prompts  # Content generation prompts
│       ├── analysis-prompts   # Analysis & breakdown prompts
│       ├── guidance-prompts   # Best practices & guidance
│       └── tutorial-prompts   # Step-by-step guides
├── config.ts                  # API key configuration
├── test-api.ts               # API testing utility
└── example.ts                # Usage examples
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- OpenAI API key

### Installation

1. **Clone and install:**
```bash
git clone <repository-url>
cd structured-output-generator
npm install
```

2. **Set up your OpenAI API key:**
```bash
# Create a .env file in the project root
echo "OPENAI_API_KEY=your-api-key-here" > .env
```

3. **Build and run:**
```bash
npm run build
npm start
```

## 📖 Usage

### Interactive Mode (Recommended)
```bash
npm start
```
This launches an interactive CLI that:
- Prompts for your search keyphrase
- Lets you choose from 5 different prompt types
- Generates structured output instantly

### Available Prompt Types

1. **subtopics-default** - Generate related subtopics with headings and descriptions
2. **analysis-breakdown** - Break down topics into key components
3. **best-practices** - Generate best practices for any topic
4. **comparison-analysis** - Compare different aspects or options
5. **step-by-step-guide** - Create detailed step-by-step instructions

### Example Output

```json
{
  "response": [
    {
      "heading": "Natural Predators",
      "description": "Exploring how the presence of natural predators like hawks and owls can deter squirrels."
    },
    {
      "heading": "Squirrel Repellents",
      "description": "An overview of commercial and homemade repellents that are effective in keeping squirrels away."
    },
    {
      "heading": "Ultrasonic Devices",
      "description": "Discussing the use of ultrasonic devices that emit high-frequency sounds to scare squirrels."
    }
  ]
}
```

## 🛠️ Development

### Available Scripts

```bash
npm run build      # Compile TypeScript
npm start          # Run interactive application
npm run test-api   # Test OpenAI API connection
npm run example    # Run usage examples
npm test           # Run test suite
npm run lint       # Check code quality
npm run dev        # Watch mode for development
```

### Testing Your Setup

```bash
# Test if your API key is working
npm run test-api

# See the system in action
npm start
# Then enter: "what scares raccoons away"
```

## 🔧 Configuration

### Prompt Templates

Prompts are stored in JSON files under `src/repositories/data/`:

- **subtopics-prompts** - For content generation
- **analysis-prompts** - For topic analysis
- **guidance-prompts** - For best practices
- **tutorial-prompts** - For step-by-step guides

Each prompt can be configured with:
- `model` - OpenAI model (gpt-4o, gpt-3.5-turbo, etc.)
- `temperature` - Creativity level (0.0-2.0)
- `maxTokens` - Response length limit
- `systemPrompt` - Custom system instructions
- `responseFormat` - Output format specification

### Custom Prompts

Add new prompts by editing the JSON files in `src/repositories/data/`:

```json
{
  "my-custom-prompt": {
    "name": "My Custom Generator",
    "description": "Generate custom content for my needs",
    "template": "Create content about \"{keyword}\" with headings and descriptions.",
    "category": "custom",
    "tags": ["custom", "specialized"],
    "model": "gpt-4o",
    "temperature": 0.3,
    "maxTokens": 1500,
    "systemPrompt": "You are a specialized assistant...",
    "responseFormat": {
      "type": "json_object"
    }
  }
}
```

## 🏛️ Architecture Details

### Repository Pattern
- **Data Layer**: JSON files store prompt templates
- **Repository Layer**: `pull_prompt.ts` handles data access
- **Service Layer**: `openai-generator.ts` contains business logic
- **Presentation Layer**: `index.ts` provides CLI interface

### Response Structure
All responses follow this consistent format:
```typescript
interface StructuredResponse {
  response: Array<{
    heading: string;
    description: string;
  }>;
}
```

### Error Handling
- API key validation
- Response structure validation
- Graceful fallbacks for missing prompts
- Clear error messages for debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Update tests if needed
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**"OPENAI_API_KEY environment variable is missing"**
- Create a `.env` file with your API key
- Or set the environment variable directly

**"400 Unknown parameter: 'response_format.schema'"**
- This was fixed in the latest version
- Make sure you're using the updated code

**"Prompt template not found"**
- Check that the prompt ID exists in the JSON files
- Verify the file paths in `pull_prompt.ts`

### Getting Help

- Check the console output for detailed error messages
- Use `npm run test-api` to verify your API key works
- Review the prompt templates in `src/repositories/data/`

---

**Built with ❤️ using TypeScript, OpenAI API, and modern development practices.** 