export async function text2Speech({
  res,
  onSuccess,
  onError,
  model = defaultAudioSpeechModels[0].model,
  voice = Text2SpeechVoiceEnum.alloy,
  input,
  speed = 1
}: {
  res: NextApiResponse;
  onSuccess: (e: { model: string; buffer: Buffer }) => void;
  onError: (e: any) => void;
  model?: string;
  voice?: `${Text2SpeechVoiceEnum}`;
  input: string;
  speed?: number;
}) {
  const ai = getAIApi();
  const response = await ai.audio.speech.create({
    model,
    voice,
    input,
    response_format: 'mp3',
    speed
  });

  const readableStream = response.body as unknown as NodeJS.ReadableStream;
  readableStream.pipe(res);

  let bufferStore = Buffer.from([]);

  readableStream.on('data', (chunk) => {
    bufferStore = Buffer.concat([bufferStore, chunk]);
  });
  readableStream.on('end', () => {
    onSuccess({ model, buffer: bufferStore });
  });
  readableStream.on('error', (e) => {
    onError(e);
  });
}