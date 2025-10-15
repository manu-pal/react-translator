# 🌍 React Text Translator

A beautiful and responsive text translator application built with React and Tailwind CSS, powered by RapidAPI's Text Translator service.

## Features

- ✨ **Clean, modern UI** with Tailwind CSS
- 🌍 **20+ languages** supported
- 🔄 **Real-time translation** using RapidAPI
- 📋 **Copy to clipboard** functionality
- ⚡ **Loading states** and error handling
- 📱 **Responsive design** for all devices
- 🔐 **Secure API key** input

## Supported Languages

**100+ Languages Supported!** Including:

- **Major Languages**: English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi
- **European Languages**: Dutch, Swedish, Danish, Norwegian, Finnish, Polish, Czech, Hungarian, Romanian, Bulgarian, Croatian, Serbian
- **Asian Languages**: Thai, Vietnamese, Indonesian, Malay, Filipino, Tamil, Telugu, Bengali, Gujarati, Punjabi, Urdu
- **African Languages**: Swahili, Yoruba, Zulu, Xhosa, Hausa, Amharic, Somali
- **Special Languages**: Latin, Esperanto, Klingon, Yoda, Shakespearean English, Morse Code, Braille, Emoji
- **And many more!** Including rare and constructed languages

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- RapidAPI account and API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd react-translator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Getting Your RapidAPI Key

1. Visit [RapidAPI Text Translator](https://rapidapi.com/divad12/api/text-translator2)
2. Sign up for a free account
3. Subscribe to the Text Translator API (free tier available)
4. Copy your API key from the dashboard

### Usage

1. **Enter your RapidAPI key** in the designated field
2. **Type your English text** in the input area
3. **Select your target language** from the dropdown
4. **Click Translate** to get your translation
5. **Copy the result** using the copy button

## API Integration

The application uses RapidAPI's Text Translator service:

- **Endpoint**: `https://text-translator2.p.rapidapi.com/translate`
- **Method**: POST
- **Authentication**: X-RapidAPI-Key header
- **Rate Limits**: Depends on your subscription plan

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Custom styles and animations
├── main.jsx         # Application entry point
└── index.css        # Global styles
```

## Technologies Used

- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool
- **RapidAPI** - Translation service
- **Fetch API** - HTTP requests

## Customization

### Adding New Languages

To add support for additional languages, update the `languages` array in `App.jsx`:

```javascript
const languages = [
  { code: "new-lang-code", name: "New Language" },
  // ... existing languages
];
```

### Styling

The application uses Tailwind CSS classes. You can customize the appearance by modifying the className attributes in the JSX.

## Error Handling

The application includes comprehensive error handling for:

- Missing API key
- Empty input text
- Network errors
- API rate limits
- Invalid responses

## Security Notes

- API keys are stored in component state (not persisted)
- For production, consider proxying API requests through your backend
- Never commit API keys to version control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:

1. Check the RapidAPI documentation
2. Verify your API key is correct
3. Ensure you have an active subscription
4. Check your network connection

---

Built with ❤️ using React and Tailwind CSS
