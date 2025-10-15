# 🔧 API Setup Instructions

## RapidAPI Configuration

To use this translator application, you need to configure your RapidAPI key. Follow these steps:

### 1. Get Your RapidAPI Key

1. Visit [OpenL Translate API](https://rapidapi.com/openl-translate/api/openl-translate)
2. Sign up for a free account if you don't have one
3. Subscribe to the "OpenL Translate" API (free tier available)
4. Copy your API key from the dashboard

### 2. Configure the Application

1. Open `src/config/api.js`
2. Replace `YOUR_RAPIDAPI_KEY_HERE` with your actual API key:

```javascript
export const API_CONFIG = {
  RAPIDAPI_KEY: "your-actual-api-key-here", // Replace this
  RAPIDAPI_HOST: "openl-translate.p.rapidapi.com",
  RAPIDAPI_URL: "https://openl-translate.p.rapidapi.com/translate",
};
```

### 3. Security Note

⚠️ **Important**: Never commit your actual API key to version control. Consider using environment variables for production deployments.

### 4. Test the Application

1. Run `npm run dev` to start the development server
2. Open your browser and navigate to the application
3. Try translating some text to verify the API is working

### 5. Production Deployment

For production, consider:

- Using environment variables for API keys
- Implementing a backend proxy to hide API keys
- Adding rate limiting and error handling

## Troubleshooting

- **"Please configure your RapidAPI key"**: Make sure you've updated the API key in `src/config/api.js`
- **Translation fails**: Check your API key and ensure you have an active subscription
- **Rate limit errors**: You may have exceeded your API quota

## Support

If you encounter issues:

1. Verify your API key is correct
2. Check your RapidAPI subscription status
3. Ensure you have remaining API calls in your quota
