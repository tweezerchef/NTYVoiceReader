
// export async function text2Speech({
//     res,
//     onSuccess,
//     onError,
//     model = defaultAudioSpeechModels[0].model,
//     voice = Text2SpeechVoiceEnum.alloy,
//     input,
//     speed = 1
//   }: {
//     res: NextApiResponse;
//     onSuccess: (e: { model: string; buffer: Buffer }) => void;
//     onError: (e: any) => void;
//     model?: string;
//     voice?: `${Text2SpeechVoiceEnum}`;
//     input: string;
//     speed?: number;
//   }) {
//     const ai = getAIApi();
//     const response = await ai.audio.speech.create({
//       model,
//       voice,
//       input,
//       response_format: 'mp3',
//       speed
//     });

//     const readableStream = response.body as unknown as NodeJS.ReadableStream;
//     readableStream.pipe(res);

//     let bufferStore = Buffer.from([]);

//     readableStream.on('data', (chunk) => {
//       bufferStore = Buffer.concat([bufferStore, chunk]);
//     });
//     readableStream.on('end', () => {
//       onSuccess({ model, buffer: bufferStore });
//     });
//     readableStream.on('error', (e) => {
//       onError(e);
//     });
//   }
import { NextApiResponse } from 'next';
import { OpenAI } from 'openai';

// Assuming Text2SpeechVoiceEnum is already defined elsewhere in your project
enum Text2SpeechVoiceEnum {
    alloy = 'alloy',
    // add other enum values as needed
}

// Typing for the onSuccess callback function
interface OnSuccessParams {
    model: string;
    buffer: Buffer;
}

// Typing for the onError callback function
interface OnErrorParams {
    error: Error;
}

// Function parameter types
interface Text2SpeechParams {
    res: NextApiResponse;
    onSuccess: (params: OnSuccessParams) => void;
    onError: (params: OnErrorParams) => void;
    model?: string;
    voice?: Text2SpeechVoiceEnum;
    input: string;
    speed?: number;
}
const openAI = new OpenAI();
export async function text2Speech({
    res,
    onSuccess,
    onError,
    model = "tts-1",
    voice = Text2SpeechVoiceEnum.alloy,
    input,
    speed = 1
}: Text2SpeechParams): Promise<void> {
    const response = await openAI.audio.speech.create({
        model,
        voice,
        input,
        response_format: 'mp3',
        speed
    });

    const readableStream: NodeJS.ReadableStream = response.body;
    readableStream.pipe(res);

    let bufferStore = Buffer.from([]);

    readableStream.on('data', (chunk: Buffer) => {
        bufferStore = Buffer.concat([bufferStore, chunk]);
    });
    readableStream.on('end', () => {
        onSuccess({ model, buffer: bufferStore });
    });
    readableStream.on('error', (error: Error) => {
        onError({ error });
    });
}
