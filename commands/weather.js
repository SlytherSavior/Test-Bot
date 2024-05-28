const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require('https');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Displays weather information for a specified city.')
        .addStringOption(option =>
            option.setName('city')
                .setDescription('The city to get weather for')
                .setRequired(true)),
    async execute(interaction) {
        const city = interaction.options.getString('city');
        const apiKey = process.env.WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        https.get(url, response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                const weatherData = JSON.parse(data);
                if (response.statusCode === 200) {
                    interaction.reply(`Weather in ${city}: ${weatherData.weather[0].description}, Temperature: ${weatherData.main.temp}°C`);
                } else {
                    console.error(`Failed to get weather data: ${weatherData.message}`);
                    interaction.reply(`Failed to get weather data for ${city}`);
                }
            });
        }).on('error', error => {
            console.error(`Error fetching weather data: ${error.message}`);
            interaction.reply('Error fetching weather data.');
        });
    }
};
