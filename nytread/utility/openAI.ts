import OpenAI from "openai";


const openai = new OpenAI();
export const  opening = async () => {
    const text =
    "Welcome to the New York Times Reader, you may stop this recording at any time by pressing the backspace button, or by pressing the space bar, which will record what you say and process it. What section are you interested in? arts, automobiles, books/review, business, fashion, food, health, home, insider, magazine, movies, nyregion, obituaries, opinion, politics, realestate, science, sports, sunday review, technology, theater, t-magazine, travel, upshot, us, world";



    const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString('base64');
}