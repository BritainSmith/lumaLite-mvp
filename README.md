# 🌟 LumaLite - Your Supportive AI Companion

A powerful CLI application that helps you organize your thoughts, process emotions, and maintain mental clarity through AI-powered interactions.

## ✨ Features

### 🧠 **Brain Dump Organization**
- **AI-powered categorization** of your thoughts into actionable categories
- **Smart sorting** into Tasks, Worries, Ideas, and Random thoughts
- **Persistent storage** with SQLite database for tracking progress
- **Historical review** of past brain dumps

### 💙 **Emotional Check-In**
- **Compassionate AI responses** to help process emotions
- **Supportive guidance** for difficult feelings
- **Non-judgmental space** for emotional expression
- **Personalized interactions** that adapt to your needs

### 🏗️ **Modern Architecture**
- **NestJS framework** for scalable, maintainable code
- **TypeORM** for robust database management
- **TypeScript** for type safety and better development experience
- **Dependency injection** for clean, testable code

### 📊 **Comprehensive Logging**
- **Winston logging** with multiple transport options
- **Daily log rotation** to manage file sizes
- **Structured logging** for better debugging
- **AI interaction tracking** for analytics and improvement

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BritainSmith/lumaLite-mvp.git
   cd lumaLite-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## 🎯 Usage

### Interactive Menu
LumaLite presents a simple, intuitive menu:

```
🌟 Welcome to LumaLite – Your Supportive AI Companion 🌟
[1] Emotional Check-In
[2] Organize My Brain Dump
[3] Exit
```

### Emotional Check-In
Share your feelings and receive supportive, compassionate responses from the AI:

```
What's on your mind today? I'm feeling anxious about work
```

### Brain Dump Organization
Dump all your thoughts and let AI organize them:

```
What's swirling around in your head? I need to buy groceries, I have a meeting tomorrow, 
I want to learn guitar, I'm worried about my presentation, I had an idea for a new project
```

The AI will categorize your thoughts into:
- **Tasks**: Actionable items (buy groceries, prepare for meeting)
- **Worries**: Concerns to address (presentation anxiety)
- **Ideas**: Creative thoughts (learn guitar, new project)
- **Random**: Miscellaneous thoughts

## 🏗️ Architecture

### Project Structure
```
lumalite/
├── src/
│   ├── entities/           # TypeORM database entities
│   ├── services/           # Business logic services
│   ├── repositories/       # Data access layer
│   ├── prompts/           # AI prompt templates
│   ├── config/            # Configuration files
│   └── main.ts            # Application entry point
├── tests/                 # Test files
├── logs/                  # Application logs
├── data/                  # SQLite database
└── coverage/              # Test coverage reports
```

### Key Components

#### **Services**
- `CompanionAgentService`: Core AI interaction logic
- `BrainDumpService`: Brain dump processing and storage
- `TaskRepository`: Database operations for task entries

#### **Entities**
- `TaskEntry`: Database model for storing organized thoughts
- `Reflection`: Model for emotional check-ins (future enhancement)

#### **Configuration**
- **TypeORM**: SQLite database with automatic migrations
- **Winston**: Multi-transport logging system
- **Jest**: Comprehensive testing framework

## 🧪 Testing & Quality

### Test Coverage
- **92.3% statement coverage**
- **100% function coverage**
- **22 passing tests** across 3 test suites
- **Comprehensive mocking** for external dependencies

### Available Scripts
```bash
npm test              # Run all tests
npm run test:cov      # Run tests with coverage report
npm run test:watch    # Watch mode for development
npm run build         # Build the application
```

### CI/CD Pipeline
- **GitHub Actions** with multi-stage pipeline
- **Automated testing** on every push and PR
- **Coverage enforcement** (80%+ requirements)
- **Security audits** and dependency checks
- **Build verification** before deployment

## 🔧 Development

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: NestJS for scalable architecture
- **Database**: SQLite with TypeORM
- **AI**: OpenAI GPT-4 via LangChain
- **Testing**: Jest with comprehensive mocking
- **Logging**: Winston with daily rotation
- **CI/CD**: GitHub Actions

### Development Setup
1. **Install dependencies**: `npm install`
2. **Run tests**: `npm test`
3. **Start development**: `npm start`
4. **Check coverage**: `npm run test:cov`

### Code Quality
- **ESLint** for code linting (TypeScript support)
- **Prettier** for consistent formatting
- **TypeScript** strict mode for type safety
- **Comprehensive error handling** throughout

## 📊 Logging & Monitoring

### Log Files
- `logs/combined-YYYY-MM-DD.log`: All application logs
- `logs/error-YYYY-MM-DD.log`: Error logs only
- `logs/ai-interactions-YYYY-MM-DD.log`: AI interaction tracking

### Log Levels
- **Error**: Application errors and exceptions
- **Warn**: Warning conditions
- **Info**: General information
- **Debug**: Detailed debugging information

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards
- **80%+ test coverage** required for all new code
- **TypeScript strict mode** compliance
- **ESLint** and **Prettier** formatting
- **Comprehensive error handling**
- **Detailed logging** for debugging

## 📈 Roadmap

### Planned Features
- [ ] **Emotional tracking** with mood analytics
- [ ] **Goal setting** and progress tracking
- [ ] **Habit formation** support
- [ ] **Web interface** for better visualization
- [ ] **Mobile app** for on-the-go support
- [ ] **Integration** with calendar and task managers
- [ ] **Export functionality** for data portability

### Technical Enhancements
- [ ] **User authentication** and multi-user support
- [ ] **Real-time notifications** for check-ins
- [ ] **Advanced analytics** and insights
- [ ] **API endpoints** for external integrations
- [ ] **Performance optimization** for large datasets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the AI capabilities
- **NestJS** team for the excellent framework
- **TypeORM** for robust database management
- **Jest** for comprehensive testing tools
- **Winston** for powerful logging capabilities

## 📞 Support

If you have any questions, issues, or suggestions:
- **Open an issue** on GitHub
- **Create a discussion** for feature requests
- **Star the repository** if you find it helpful

---

**Built with ❤️ for better mental health and productivity**
